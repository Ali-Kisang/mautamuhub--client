import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import NavBar from "./components/NavBar";
import UsersList from "./pages/UsersList";
import CreateAccount from "./pages/CreateAccount";
import OnBoarding from "./components/onboading/OnobardingWizzard";
import ProfilePage from "./pages/ProfilePage";
import ProfileDetailsPage from "./pages/ProfileDetailsPage";
import ChatPage from "./pages/ChatPage";
import { useAuthStore } from "./store/useAuthStore";
import SocketManager from "./pages/SocketManager";
import Kisii from "./constants/components/Kisii";
import Nairobi from "./constants/components/Nairobi";
import Nyamira from "./constants/components/Nyamira";
import Migori from "./constants/components/Migori";
import Vihiga from "./constants/components/Vihiga";
import HomaBay from "./constants/components/HomaBay";
import Kisumu from "./constants/components/Kisumu";
import Busia from "./constants/components/Busia";
import Bungoma from "./constants/components/Bungoma";
import Kakamega from "./constants/components/Kakamega";
import Bomet from "./constants/components/Bomet";
import Kericho from "./constants/components/Kericho";
import Kajiado from "./constants/components/Kajiado";
import Narok from "./constants/components/Narok";
import Nakuru from "./constants/components/Nakuru";
import Laikipia from "./constants/components/Laikipia";
import Baringo from "./constants/components/Baringo";
import Nandi from "./constants/components/Nandi";
import UasinGishu from "./constants/components/UasinGishu";
import TransNzoia from "./constants/components/TransNzoia";
import Samburu from "./constants/components/Samburu";
import West from "./constants/components/West";
import Turkana from "./constants/components/Turkana";
import Muranga from "./constants/components/Muranga";
import Kiambu from "./constants/components/Kiambu";
import Kirinyaga from "./constants/components/Kirinyaga";
import Nyeri from "./constants/components/Nyeri";
import Nyandarua from "./constants/components/Nyandarua";
import Makueni from "./constants/components/Makueni";
import Machakos from "./constants/components/Machakos";
import Kitui from "./constants/components/Kitui";
import Embu from "./constants/components/Embu";
import TharakaNithi from "./constants/components/TharakaNithi";
import Meru from "./constants/components/Meru";
import Isiolo from "./constants/components/Isiolo";
import Marsabit from "./constants/components/Marsabit";
import Wajir from "./constants/components/Wajir";
import Lamu from "./constants/components/Lamu";
import TaitaTaveta from "./constants/components/TaitaTaveta";
import TanaRiver from "./constants/components/TanaRiver";
import Kilifi from "./constants/components/Kilifi";
import Kwale from "./constants/components/Kwale";
import Mombasa from "./constants/components/Mombasa";
import Hero from "./constants/components/Hero";
import Garissa from "./constants/components/Garissa";
import Mandera from "./constants/components/Mandera";
import ElgeyoMarakwet from "./constants/components/ElgeyoMarakwet";
import Siaya from "./constants/components/Siaya";
import SearchPage from "./pages/SearchPage";
import ErrorPage from "./pages/ErrorPage";
import AgeWarningBanner from "./constants/components/AgeWarningBanner";
import TooYoung from "./constants/components/TooYoung";
import TermsAndConditions from "./constants/components/TermsAndConditions";
import PrivacyPolicy from "./constants/components/PrivacyPolicy";
import RefundPolicy from "./constants/components/RefundPolicy";
import PaymentMethods from "./constants/components/PaymentMethods";
import { useEffect } from "react";
import Loader from "./pages/Loader";
import EditProfile from "./pages/EditProfile";

 function PrivateRoute({ children }) {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" replace />;
}


export default function App() {

  const { checkAuth, loading } = useAuthStore();

 useEffect(() => {
  checkAuth();
}, [checkAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader text="Restoring your session..." size={40} color="text-pink-500" />
      </div>
    );
  }
  return (
    <BrowserRouter>
     
      <AgeWarningBanner />
      
      <NavBar />  
<SocketManager />
      <Routes>
        <Route path="/" element={<Hero/>} />
        <Route path="/too-young" element={<TooYoung />} />
        
        <Route path="/create-account" element={ <PrivateRoute><CreateAccount /></PrivateRoute>} />
        <Route path="/onboading" element={<OnBoarding />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route
  path="/profile"
  element={
    <PrivateRoute>
      <ProfilePage />
    </PrivateRoute>
  }
/>
        
         <Route path="*" element={<ErrorPage />} />
       <Route
  path="/chat/:id"
  element={
    <PrivateRoute>
      <Chat />
    </PrivateRoute>
  }
/>
          <Route path="/profile/:id" element={<ProfileDetailsPage />} />
          
          <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
           <Route path="/search" element={<SearchPage />} />
           <Route path="/mombasa-escorts" element={<Mombasa />} />
        <Route path="/kwale-escorts" element={<Kwale />} />
        <Route path="/kilifi-escorts" element={<Kilifi />} />
        <Route path="/tana-river-escorts" element={<TanaRiver />} />
        <Route path="/taita-taveta-escorts" element={<TaitaTaveta />} />
        <Route path="/lamu-escorts" element={<Lamu />} />
        <Route path="/garissa-escorts" element={<Garissa />} />
        <Route path="/wajir-escorts" element={<Wajir />} />
        <Route path="/mandera-escorts" element={<Mandera />} />
        <Route path="/marsabit-escorts" element={<Marsabit />} />
        <Route path="/isiolo-escorts" element={<Isiolo />} />
        <Route path="/meru-escorts" element={<Meru />} />
        <Route path="/tharaka-nithi-escorts" element={<TharakaNithi />} />
        <Route path="/embu-escorts" element={<Embu />} />
        <Route path="/kitui-escorts" element={<Kitui />} />
        <Route path="/machakos-escorts" element={<Machakos />} />
        <Route path="/makueni-escorts" element={<Makueni />} />
        <Route path="/nyandarua-escorts" element={<Nyandarua />} />
        <Route path="/nyeri-escorts" element={<Nyeri />} />
        <Route path="/kirinyaga-escorts" element={<Kirinyaga />} />
        <Route path="/muranga-escorts" element={<Muranga />} />
        <Route path="/kiambu-escorts" element={<Kiambu />} />
        <Route path="/turkana-escorts" element={<Turkana />} />
       <Route path="/west-pokot-escorts" element={<West />} />
        <Route path="/samburu-escorts" element={<Samburu />} />
        <Route path="/trans-nzoia-escorts" element={<TransNzoia />} />
        <Route path="/uasin-gishu-escorts" element={<UasinGishu />} />
        <Route path="/elgeyo-marakwet-escorts" element={<ElgeyoMarakwet />} />
        <Route path="/nandi-escorts" element={<Nandi />} />
        <Route path="/baringo-escorts" element={<Baringo />} />
        <Route path="/laikipia-escorts" element={<Laikipia />} />
        <Route path="/nakuru-escorts" element={<Nakuru />} />
        <Route path="/narok-escorts" element={<Narok />} />
        <Route path="/kajiado-escorts" element={<Kajiado />} />
        <Route path="/kericho-escorts" element={<Kericho />} />
        <Route path="/bomet-escorts" element={<Bomet />} />
        <Route path="/kakamega-escorts" element={<Kakamega />} />
        <Route path="/vihiga-escorts" element={<Vihiga />} />
        <Route path="/bungoma-escorts" element={<Bungoma />} />
        <Route path="/busia-escorts" element={<Busia />} />
        <Route path="/siaya-escorts" element={<Siaya />} />
        <Route path="/kisumu-escorts" element={<Kisumu />} />
        <Route path="/homabay-escorts" element={<HomaBay />} />
        <Route path="/migori-escorts" element={<Migori />} />
        <Route path="/kisii-escorts" element={<Kisii />} />
        <Route path="/nyamira-escorts" element={<Nyamira />} />
        <Route path="/nairobi-escorts" element={<Nairobi />} /> 
        <Route path= "/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy/>} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        
      </Routes>
    </BrowserRouter>
  );
}
