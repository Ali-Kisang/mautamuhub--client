import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";


const TanaRiver = () => {
  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchTanaRiverData = async () => {
      try {
        const response = await api.get("/counties/grouped");
        console.log(response.data);

        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for TanaRiver (_id === "TanaRiver")
        const tanaRiverVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Tana River")
            ?.users || [];
        const tanaRiverRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Tana River")
            ?.users || [];

        setVipAccounts(tanaRiverVIPAccounts);
        setRegularAccounts(tanaRiverRegularAccounts);
      } catch (error) {
        console.error("Error fetching TanaRiver data", error);
      }
    };

    fetchTanaRiverData();
  }, []);

  return (
    <HomeLayout>
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Kilifi Escorts
      </h1>

      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Tana River", users: vipAccounts }]}
      />

      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Tana River", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default TanaRiver;
