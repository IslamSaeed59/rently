import React from "react";
import Hero from "../../components/Home/Hero";
import Categories from "../../components/Home/Categories";
import MostSearched from "../../components/Home/MostSearched";
import OurProducts from "../../components/Home/OurProducts";

const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <MostSearched />
      <OurProducts />
    </>
  );
};

export default Home;
