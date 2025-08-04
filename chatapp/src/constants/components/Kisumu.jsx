import { useState, useEffect } from "react";
import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Kisumu = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchKisumuData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Kisumu (_id === "Kisumu")
        const kisumuVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Kisumu")
            ?.users || [];
        const kisumuRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Kisumu")
            ?.users || [];

        setVipAccounts(kisumuVIPAccounts);
        setRegularAccounts(kisumuRegularAccounts);

        showToast("Kisumu escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Kisumu data", error);
        showToast(
          "Failed to load Kisumu escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchKisumuData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Kisumu Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Kisumu", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Kisumu", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Kisumu;
