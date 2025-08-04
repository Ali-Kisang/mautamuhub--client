import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Kirinyaga = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchKirinyagaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Kirinyaga (_id === "Kirinyaga")
        const kirinyagaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Kirinyaga")?.users ||
          [];
        const kirinyagaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Kirinyaga")
            ?.users || [];

        setVipAccounts(kirinyagaVIPAccounts);
        setRegularAccounts(kirinyagaRegularAccounts);

        showToast("Kirinyaga escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Kirinyaga data", error);
        showToast(
          "Failed to load Kirinyaga escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchKirinyagaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Kirinyaga Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Kirinyaga", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Kirinyaga", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Kirinyaga;
