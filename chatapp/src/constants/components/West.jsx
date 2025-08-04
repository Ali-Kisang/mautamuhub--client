// src/constants/components/West.jsx

import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const West = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchWestPokotData = async () => {
      dispatch(showLoading());
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        const westPokotVIPAccounts =
          vipAccountsByCounty.find(
            (county) => county._id.toLowerCase() === "west pokot"
          )?.users || [];

        const westPokotRegularAccounts =
          regularAccountsByCounty.find(
            (county) => county._id.toLowerCase() === "west pokot"
          )?.users || [];

        setVipAccounts(westPokotVIPAccounts);
        setRegularAccounts(westPokotRegularAccounts);

        showToast("West Pokot escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching West Pokot data", error);
        showToast(
          "Failed to load West Pokot escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchWestPokotData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to West Pokot Escorts
      </h1>
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "West Pokot", users: vipAccounts }]}
      />
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "West Pokot", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default West;
