const db = require("../../../Config/db");

const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Products
    const [productCount] = await db.execute(
      "SELECT COUNT(*) as count FROM products",
    );

    // 2. Total Users & Status
    const [userStats] = await db.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN verification_status = 'verified' THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN verification_status != 'verified' OR verification_status IS NULL THEN 1 ELSE 0 END) as unverified
      FROM users WHERE Email != 'admin@gmail.com'
    `);

    // 3. Rental Requests & Revenue
    const [requestStats] = await db.execute(`
      SELECT 
        request_status as status,
        COUNT(*) as count,
        SUM(total_price) as revenue
      FROM rental_requests 
      GROUP BY request_status
    `);

    // 4. Top Categories
    const [topCategories] = await db.execute(`
      SELECT c.name, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY product_count DESC LIMIT 5
    `);

    // 5. Recent Products
    const [recentProducts] = await db.execute(`
      SELECT p.*, pi.image_url as primary_image, u.Firstname as seller_name 
      FROM products p 
      JOIN users u ON p.seller_id = u.id 
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      ORDER BY p.created_at DESC LIMIT 4
    `);

    // 6. Latest Users
    const [latestUsers] = await db.execute(`
      SELECT u.id, u.Firstname, u.LastName, u.Email, pr.profile_image, (u.verification_status = 'verified') as is_verified, u.created_at 
      FROM users u
      LEFT JOIN profiles pr ON u.id = pr.user_id
      WHERE u.Email != 'admin@gmail.com' 
      ORDER BY u.created_at DESC LIMIT 4
    `);

    // 7. Revenue History (Last 14 days)
    const [revenueHistory] = await db.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%b %d') as label,
        SUM(total_price) as value
      FROM rental_requests
      WHERE request_status = 'accepted' 
      AND created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
      GROUP BY label, DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    // 8. User Activity (Last 14 days)
    const [userActivity] = await db.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%b %d') as label,
        COUNT(*) as value
      FROM users
      WHERE Email != 'admin@gmail.com'
      AND created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
      GROUP BY label, DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    // Format Revenue data
    const acceptedRevenue =
      requestStats.find((r) => r.status === "accepted")?.revenue || 0;
    const pendingRevenue =
      requestStats.find((r) => r.status === "pending")?.revenue || 0;
    const pendingCount =
      requestStats.find((r) => r.status === "pending")?.count || 0;

    // 9. Platform Commission (Admin Wallet Balance)
    const [adminWallet] = await db.execute(`
      SELECT available_balance FROM wallets 
      WHERE user_id = (SELECT id FROM users WHERE Email = 'admin@gmail.com' LIMIT 1)
    `);
    const platformCommission = adminWallet[0]?.available_balance || 0;

    const finalData = {
      stats: [
        {
          name: "Total Products",
          value: productCount[0].count,
          trend: "+5%",
          isUp: true,
        },
        {
          name: "Total Users",
          value: userStats[0].total,
          trend: `Verified: ${userStats[0].verified}`,
          isUp: true,
        },
        {
          name: "Platform Fees (10%)",
          value: `EGP ${platformCommission}`,
          trend: "Total Earned",
          isUp: true,
        },
        {
          name: "Accepted Volume",
          value: `EGP ${acceptedRevenue}`,
          trend: "Total Volume",
          isUp: true,
        },
      ],
      recentProducts,
      latestUsers,
      topCategories,
      userStatus: userStats[0],
      charts: {
        revenue: revenueHistory,
        users: userActivity,
      },
    };
    res.json(finalData);
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};

module.exports = { getDashboardStats };
