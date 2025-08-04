import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Nyandarua = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchNyandaruaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Nyandarua (_id === "Nyandarua")
        const nyandaruaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Nyandarua")
            ?.users || [];
        const nyandaruaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Nyandarua")
            ?.users || [];

        setVipAccounts(nyandaruaVIPAccounts);
        setRegularAccounts(nyandaruaRegularAccounts);

        showToast("Nyandarua escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Nyandarua data", error);
        showToast(
          "Failed to load Nyandarua escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchNyandaruaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Nyandarua Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Nyandarua", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Nyandarua", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Nyandarua;
