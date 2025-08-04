import { useState, useEffect } from "react";
import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Narok = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchNarokData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Narok (_id === "Narok")
        const narokVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Narok")?.users ||
          [];
        const narokRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Narok")
            ?.users || [];

        setVipAccounts(narokVIPAccounts);
        setRegularAccounts(narokRegularAccounts);

        showToast("Narok escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Narok data", error);
        showToast(
          "Failed to load Narok escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchNarokData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Narok Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Narok", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Narok", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Narok;
