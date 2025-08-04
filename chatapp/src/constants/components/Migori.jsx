import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Migori = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchMigoriData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Migori (_id === "Migori")
        const migoriVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Migori")
            ?.users || [];
        const migoriRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Migori")
            ?.users || [];

        setVipAccounts(migoriVIPAccounts);
        setRegularAccounts(migoriRegularAccounts);

        showToast("Migori escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Migori data", error);
        showToast(
          "Failed to load Migori escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchMigoriData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Migori Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Migori", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Migori", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Migori;
