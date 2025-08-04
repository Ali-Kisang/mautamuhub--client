import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";


const Mombasa = () => {
  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchMombasaData = async () => {
      try {
        const response = await api.get("/counties/grouped");
        console.log(response.data);

        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Mombasa (_id === "Mombasa")
        const mombasaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Mombasa")
            ?.users || [];
        const mombasaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Mombasa")
            ?.users || [];

        setVipAccounts(mombasaVIPAccounts);
        setRegularAccounts(mombasaRegularAccounts);
      } catch (error) {
        console.error("Error fetching Mombasa data", error);
      }
    };

    fetchMombasaData();
  }, []);

  return (
    <HomeLayout>
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Mombasa Escorts
      </h1>

      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Mombasa", users: vipAccounts }]}
      />

      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Mombasa", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Mombasa;
