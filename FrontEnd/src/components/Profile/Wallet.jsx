import React, { useState, useEffect } from "react";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const Wallet = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:9000/api/payments/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWalletData(res.data);
    } catch (error) {
      console.error("Failed to fetch wallet", error);
      Swal.fire("Error", "Failed to load wallet data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleDeposit = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Top Up Wallet",
      customClass: {
        popup: "rounded-3xl p-4 md:p-6",
        title: "text-2xl font-black text-[#050F2A]",
        confirmButton:
          "bg-[#050F2A] text-white rounded-xl font-bold px-8 py-3.5 hover:bg-opacity-90 transition-all outline-none mx-2",
        cancelButton:
          "bg-gray-100 text-gray-800 rounded-xl font-bold px-8 py-3.5 hover:bg-gray-200 transition-all outline-none mx-2",
      },
      buttonsStyling: false,
      html: `
        <div class="space-y-6 text-left font-sans mt-6">
          <!-- Instruction Block -->
          <div class="bg-gradient-to-br from-[#B1A1FF]/10 to-[#B1A1FF]/5 p-5 rounded-2xl border border-[#B1A1FF]/20">
            <h3 class="font-bold text-[#050F2A] mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#B1A1FF]"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
              Transfer Instructions
            </h3>
            <p class="text-sm text-gray-600 mb-4 leading-relaxed">Please transfer your desired amount to one of our official accounts below, then fill out this form to claim your deposit:</p>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
                <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Vodafone Cash</p>
                <p class="font-black text-[#050F2A] text-sm md:text-base">01023587689</p>
              </div>
              <div class="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
                <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">InstaPay</p>
                <p class="font-black text-[#050F2A] text-sm md:text-base">Rently@InstaPay</p>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-[#050F2A] mb-1.5">Transferred Amount</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 font-bold">EGP</span>
                <input id="deposit-amount" type="number" min="1" class="pl-14 block w-full rounded-xl border-gray-200 shadow-sm border p-3.5 focus:border-[#B1A1FF] focus:ring focus:ring-[#B1A1FF]/20 transition-all outline-none font-medium text-[#050F2A]" placeholder="0.00">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-bold text-[#050F2A] mb-1.5">Transfer Method Used</label>
              <div class="relative">
                <select id="deposit-method" class="block w-full rounded-xl border-gray-200 shadow-sm border p-3.5 focus:border-[#B1A1FF] focus:ring focus:ring-[#B1A1FF]/20 transition-all outline-none bg-white font-medium text-[#050F2A] appearance-none cursor-pointer">
                  <option value="Vodafone Cash">Vodafone Cash</option>
                  <option value="InstaPay">InstaPay</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-[#050F2A] mb-1.5">Sender Details</label>
              <input id="deposit-phone" type="text" class="block w-full rounded-xl border-gray-200 shadow-sm border p-3.5 focus:border-[#B1A1FF] focus:ring focus:ring-[#B1A1FF]/20 transition-all outline-none font-medium text-[#050F2A]" placeholder="Sender phone number or transaction ID">
              <p class="text-[11px] text-gray-500 mt-2 ml-1 flex items-center gap-1 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                Required to verify your transfer
              </p>
            </div>
          </div>

          <div class="bg-blue-50/80 p-4 rounded-xl border border-blue-100 flex items-start gap-3 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500 mt-0.5 shrink-0"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            <p class="text-xs text-blue-800 leading-relaxed font-medium">
              <strong>Demo Note:</strong> For testing purposes, funds are added instantly after submission. In production, this would be pending admin approval.
            </p>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit Request",
      preConfirm: () => {
        const amount = document.getElementById("deposit-amount").value;
        const phone = document.getElementById("deposit-phone").value;
        const method = document.getElementById("deposit-method").value;

        if (!amount || amount <= 0) {
          Swal.showValidationMessage("Please enter a valid amount");
          return false;
        }
        if (!phone || phone.trim().length < 3) {
          Swal.showValidationMessage("Please enter valid sender details");
          return false;
        }
        return { amount, phone, method };
      },
    });

    if (formValues) {
      try {
        Swal.fire({
          title: "Connecting to Payment Gateway...",
          html:
            "Please wait while we process your request through <b>" +
            formValues.method +
            "</b>",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        // Simulate a bit of processing time to make it feel "real"
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:9000/api/payments/wallet/deposit",
          formValues,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        Swal.fire({
          icon: "success",
          title: "Deposit Successful",
          text: `${formValues.amount} EGP added to your wallet via ${formValues.method}!`,
          confirmButtonColor: "#050F2A",
        });
        fetchWallet();
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to add funds",
          "error",
        );
      }
    }
  };

  const handleWithdrawal = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Request Withdrawal",
      html: `
        <div class="space-y-4 text-left">
          <p class="text-sm text-gray-500">Available Balance: <span class="font-bold text-black">${walletData?.wallet?.available_balance || 0} EGP</span></p>
          <div>
            <label class="block text-sm font-medium text-gray-700">Amount (EGP)</label>
            <input id="swal-amount" type="number" min="1" max="${walletData?.wallet?.available_balance || 0}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500" placeholder="0.00">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Withdrawal Method</label>
            <select id="swal-method" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 mb-3">
              <option value="Vodafone Cash">Vodafone Cash</option>
              <option value="Instapay">Instapay</option>
            </select>
            <label class="block text-sm font-medium text-gray-700">Account Details (Number / Address)</label>
            <input id="swal-phone" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500" placeholder="010xxxxxxx or name@instapay">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit Request",
      confirmButtonColor: "#B1A1FF",
      preConfirm: () => {
        const amountStr = document.getElementById("swal-amount").value;
        const method = document.getElementById("swal-method").value;
        const phone = document.getElementById("swal-phone").value;
        const amount = Number(amountStr);
        const availableBalance = Number(
          walletData?.wallet?.available_balance || 0,
        );

        if (!amount || amount <= 0 || amount > availableBalance) {
          Swal.showValidationMessage(
            `Please enter a valid amount within your available balance (${availableBalance} EGP)`,
          );
          return false;
        }
        if (!phone || phone.trim().length < 5) {
          Swal.showValidationMessage(
            "Please enter a valid Vodafone Cash number or Instapay address",
          );
          return false;
        }
        return { amount, method, account_details: phone };
      },
    });

    if (formValues) {
      try {
        Swal.fire({
          title: "Processing...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:9000/api/payments/wallet/withdraw",
          formValues,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        Swal.fire(
          "Success",
          "Withdrawal request submitted successfully!",
          "success",
        );
        fetchWallet(); // refresh data
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to submit request",
          "error",
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { wallet, transactions, withdrawals } = walletData || {};

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-[#050F2A] mb-8 flex items-center gap-3">
        <WalletIcon className="text-[#B1A1FF]" size={32} />
        My Wallet
      </h1>

      {/* Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-gray-500 font-medium mb-1">Available Balance</p>
            <h2 className="text-4xl font-black text-[#050F2A]">
              {wallet?.available_balance || "0.00"} EGP
            </h2>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleDeposit}
              className="flex-1 bg-[#B1A1FF] text-white py-3 px-6 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-[#B1A1FF]/20"
            >
              Add Funds
            </button>
            <button
              onClick={handleWithdrawal}
              disabled={!wallet || wallet.available_balance <= 0}
              className="flex-1 bg-[#050F2A] text-white py-3 px-6 rounded-xl font-bold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2 text-orange-500">
            <Clock size={20} />
            <p className="font-medium">Pending Escrow</p>
          </div>
          <h2 className="text-3xl font-black text-gray-800">
            {wallet?.pending_balance || "0.00"} EGP
          </h2>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-500">
              Funds held securely in escrow. They will be transferred to your
              available balance (minus 10% commission) once the rental period
              ends successfully.
            </p>
            <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
              <p className="text-[11px] text-orange-700 leading-relaxed font-medium">
                <strong>Note:</strong> Funds only appear here after the buyer
                completes the payment for an accepted booking request.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <h2 className="text-xl font-bold text-[#050F2A] mb-4">
        Transaction History
      </h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
        {transactions && transactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      [
                        "deposit_escrow",
                        "escrow_release",
                        "commission_earned",
                      ].includes(tx.type)
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {[
                      "deposit_escrow",
                      "escrow_release",
                      "commission_earned",
                    ].includes(tx.type) ? (
                      <ArrowDownLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#050F2A] capitalize">
                      {tx.type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{tx.description}</p>
                  </div>
                </div>
                <div
                  className={`font-black ${
                    [
                      "deposit_escrow",
                      "escrow_release",
                      "commission_earned",
                    ].includes(tx.type)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {[
                    "deposit_escrow",
                    "escrow_release",
                    "commission_earned",
                  ].includes(tx.type)
                    ? "+"
                    : "-"}
                  {tx.amount} EGP
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No transactions yet.
          </div>
        )}
      </div>

      {/* Withdrawal Requests */}
      <h2 className="text-xl font-bold text-[#050F2A] mb-4">
        Withdrawal Requests
      </h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {withdrawals && withdrawals.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {withdrawals.map((req) => (
              <div
                key={req.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-[#050F2A]">
                    {req.amount} EGP via {req.method}
                  </p>
                  <p className="text-sm text-gray-500">
                    Details: {req.account_details}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(req.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {req.status === "pending" && (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Clock size={14} /> Pending
                    </span>
                  )}
                  {req.status === "approved" && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Approved
                    </span>
                  )}
                  {req.status === "rejected" && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <XCircle size={14} /> Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No withdrawal requests.
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
