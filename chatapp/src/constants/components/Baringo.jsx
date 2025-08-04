import { useState, useEffect } from "react";
import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Baringo = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchBaringoData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Baringo (_id === "Baringo")
        const baringoVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Baringo")
            ?.users || [];
        const baringoRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Baringo")
            ?.users || [];

        setVipAccounts(baringoVIPAccounts);
        setRegularAccounts(baringoRegularAccounts);

        showToast("Baringo escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Baringo data", error);
        showToast(
          "Failed to load Baringo escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchBaringoData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Baringo Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Baringo", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Baringo", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Baringo;
