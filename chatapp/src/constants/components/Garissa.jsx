import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Garissa = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchGarissaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Garissa (_id === "Garissa")
        const garissaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Garissa")?.users ||
          [];
        const garissaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Garissa")
            ?.users || [];

        setVipAccounts(garissaVIPAccounts);
        setRegularAccounts(garissaRegularAccounts);

        showToast("Garissa escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Garissa data", error);
        showToast(
          "Failed to load Garissa escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchGarissaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Garissa Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Garissa", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Garissa", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Garissa;
