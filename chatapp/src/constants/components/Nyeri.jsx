import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Nyeri = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchNyeriData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Nyeri (_id === "Nyeri")
        const nyeriVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Nyeri")?.users ||
          [];
        const nyeriRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Nyeri")
            ?.users || [];

        setVipAccounts(nyeriVIPAccounts);
        setRegularAccounts(nyeriRegularAccounts);

        showToast("Nyeri escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Nyeri data", error);
        showToast(
          "Failed to load Nyeri escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchNyeriData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Nyeri Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Nyeri", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Nyeri", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Nyeri;
