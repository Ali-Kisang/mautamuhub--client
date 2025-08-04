import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Machakos = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchMachakosData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Machakos (_id === "Machakos")
        const machakosVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Machakos")?.users ||
          [];
        const machakosRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Machakos")
            ?.users || [];

        setVipAccounts(machakosVIPAccounts);
        setRegularAccounts(machakosRegularAccounts);

        showToast("Machakos escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Machakos data", error);
        showToast(
          "Failed to load Machakos escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchMachakosData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Machakos Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Machakos", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Machakos", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Machakos;
