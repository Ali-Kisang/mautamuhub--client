import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Nakuru = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchNakuruData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Nakuru (_id === "Nakuru")
        const nakuruVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Nakuru")
            ?.users || [];
        const nakuruRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Nakuru")
            ?.users || [];

        setVipAccounts(nakuruVIPAccounts);
        setRegularAccounts(nakuruRegularAccounts);

        showToast("Nakuru escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Nakuru data", error);
        showToast(
          "Failed to load Nakuru escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchNakuruData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Nakuru Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Nakuru", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Nakuru", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Nakuru;
