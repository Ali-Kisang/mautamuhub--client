import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Marsabit = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchMarsabitData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Marsabit (_id === "Marsabit")
        const marsabitVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Marsabit")?.users ||
          [];
        const marsabitRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Marsabit")
            ?.users || [];

        setVipAccounts(marsabitVIPAccounts);
        setRegularAccounts(marsabitRegularAccounts);

        showToast("Marsabit escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Marsabit data", error);
        showToast(
          "Failed to load Marsabit escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchMarsabitData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Marsabit Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Marsabit", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Marsabit", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Marsabit;
