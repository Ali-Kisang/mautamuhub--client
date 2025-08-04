import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Kitui = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchKituiData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Kitui (_id === "Kitui")
        const kituiVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Kitui")?.users ||
          [];
        const kituiRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Kitui")
            ?.users || [];

        setVipAccounts(kituiVIPAccounts);
        setRegularAccounts(kituiRegularAccounts);

        showToast("Kitui escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Kitui data", error);
        showToast(
          "Failed to load Kitui escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchKituiData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Kitui Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Kitui", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Kitui", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Kitui;
