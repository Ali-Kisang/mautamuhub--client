import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";  // ✅ NEW: For lazy-loading
import Register from "./pages/Register";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import { useAuthStore } from "./store/useAuthStore";
import SocketManager from "./pages/SocketManager";
import Hero from "./constants/components/Hero";  // ✅ Eager: Lightweight landing
import AgeWarningBanner from "./constants/components/AgeWarningBanner";
import TooYoung from "./constants/components/TooYoung";
import TermsAndConditions from "./constants/components/TermsAndConditions";
import PrivacyPolicy from "./constants/components/PrivacyPolicy";
import RefundPolicy from "./constants/components/RefundPolicy";
import PaymentMethods from "./constants/components/PaymentMethods";
import ErrorPage from "./pages/ErrorPage";  // ✅ Eager: Simple error UI
import { useEffect } from "react";
import Loader from "./pages/Loader";
import TawkToChat from "./pages/TawkToChat";


// ✅ NEW: Lazy-load heavy pages (county lists, chats, profiles—likely image/data-heavy)
const Chat = lazy(() => import("./pages/Chat"));
const UsersList = lazy(() => import("./pages/UsersList"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const OnBoarding = lazy(() => import("./components/onboading/OnobardingWizzard"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProfileDetailsPage = lazy(() => import("./pages/ProfileDetailsPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const Kisii = lazy(() => import("./constants/components/Kisii"));
const Nairobi = lazy(() => import("./constants/components/Nairobi"));
const Nyamira = lazy(() => import("./constants/components/Nyamira"));
const Migori = lazy(() => import("./constants/components/Migori"));
const Vihiga = lazy(() => import("./constants/components/Vihiga"));
const HomaBay = lazy(() => import("./constants/components/HomaBay"));
const Kisumu = lazy(() => import("./constants/components/Kisumu"));
const Busia = lazy(() => import("./constants/components/Busia"));
const Bungoma = lazy(() => import("./constants/components/Bungoma"));
const Kakamega = lazy(() => import("./constants/components/Kakamega"));
const Bomet = lazy(() => import("./constants/components/Bomet"));
const Kericho = lazy(() => import("./constants/components/Kericho"));
const Kajiado = lazy(() => import("./constants/components/Kajiado"));
const Narok = lazy(() => import("./constants/components/Narok"));
const Nakuru = lazy(() => import("./constants/components/Nakuru"));
const Laikipia = lazy(() => import("./constants/components/Laikipia"));
const Baringo = lazy(() => import("./constants/components/Baringo"));
const Nandi = lazy(() => import("./constants/components/Nandi"));
const UasinGishu = lazy(() => import("./constants/components/UasinGishu"));
const TransNzoia = lazy(() => import("./constants/components/TransNzoia"));
const Samburu = lazy(() => import("./constants/components/Samburu"));
const West = lazy(() => import("./constants/components/West"));
const Turkana = lazy(() => import("./constants/components/Turkana"));
const Muranga = lazy(() => import("./constants/components/Muranga"));
const Kiambu = lazy(() => import("./constants/components/Kiambu"));
const Kirinyaga = lazy(() => import("./constants/components/Kirinyaga"));
const Nyeri = lazy(() => import("./constants/components/Nyeri"));
const Nyandarua = lazy(() => import("./constants/components/Nyandarua"));
const Makueni = lazy(() => import("./constants/components/Makueni"));
const Machakos = lazy(() => import("./constants/components/Machakos"));
const Kitui = lazy(() => import("./constants/components/Kitui"));
const Embu = lazy(() => import("./constants/components/Embu"));
const TharakaNithi = lazy(() => import("./constants/components/TharakaNithi"));
const Meru = lazy(() => import("./constants/components/Meru"));
const Isiolo = lazy(() => import("./constants/components/Isiolo"));
const Marsabit = lazy(() => import("./constants/components/Marsabit"));
const Wajir = lazy(() => import("./constants/components/Wajir"));
const Lamu = lazy(() => import("./constants/components/Lamu"));
const TaitaTaveta = lazy(() => import("./constants/components/TaitaTaveta"));
const TanaRiver = lazy(() => import("./constants/components/TanaRiver"));
const Kilifi = lazy(() => import("./constants/components/Kilifi"));
const Kwale = lazy(() => import("./constants/components/Kwale"));
const Mombasa = lazy(() => import("./constants/components/Mombasa"));
const Garissa = lazy(() => import("./constants/components/Garissa"));
const Mandera = lazy(() => import("./constants/components/Mandera"));
const ElgeyoMarakwet = lazy(() => import("./constants/components/ElgeyoMarakwet"));
const Siaya = lazy(() => import("./constants/components/Siaya"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const UpgradeAccount = lazy(() => import("./components/onboading/steps/UpgradeAccount"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

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
      <TawkToChat />
      <Routes>
        {/* ✅ Eager: Lightweight/static pages */}
        <Route path="/" element={<Hero />} />
        <Route path="/too-young" element={<TooYoung />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />  {/* ✅ Fixed: Removed space in path= */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="*" element={<ErrorPage />} />

        {/* ✅ Lazy-wrapped: Heavy/auth pages with Suspense */}
        <Route
          path="/create-account"
          element={
            <PrivateRoute>
              <Suspense fallback={<div className="flex items-center justify-center h-64">Loading account setup...</div>}>
                <CreateAccount />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/onboading"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading onboarding...</div>}>
              <OnBoarding />
            </Suspense>
          }
        />
        <Route
          path="/users"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading users...</div>}>
              <UsersList />
            </Suspense>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading editor...</div>}>
              <EditProfile />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Suspense fallback={<div className="flex items-center justify-center h-64">Loading profile...</div>}>
                <ProfilePage />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <PrivateRoute>
              <Suspense fallback={<div className="flex items-center justify-center h-64">Starting chat...</div>}>
                <Chat />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading details...</div>}>
              <ProfileDetailsPage />
            </Suspense>
          }
        />
        <Route
          path="/upgrade-account"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading upgrade...</div>}>
              <UpgradeAccount />
            </Suspense>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Suspense fallback={<div className="flex items-center justify-center h-64">Loading chats...</div>}>
                <ChatPage />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Searching...</div>}>
              <SearchPage />
            </Suspense>
          }
        />

        {/* ✅ Lazy-wrapped: All county pages (these are prime for splitting—image lists) */}
        <Route
          path="/nairobi-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Nairobi profiles...</div>}>
              <Nairobi />
            </Suspense>
          }
        />
        <Route
          path="/mombasa-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Mombasa profiles...</div>}>
              <Mombasa />
            </Suspense>
          }
        />
        <Route
          path="/kwale-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Kwale profiles...</div>}>
              <Kwale />
            </Suspense>
          }
        />
        <Route
          path="/kilifi-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Kilifi profiles...</div>}>
              <Kilifi />
            </Suspense>
          }
        />
        <Route
          path="/tana-river-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Tana River profiles...</div>}>
              <TanaRiver />
            </Suspense>
          }
        />
        <Route
          path="/taita-taveta-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Taita Taveta profiles...</div>}>
              <TaitaTaveta />
            </Suspense>
          }
        />
        <Route
          path="/lamu-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Lamu profiles...</div>}>
              <Lamu />
            </Suspense>
          }
        />
        <Route
          path="/garissa-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Garissa profiles...</div>}>
              <Garissa />
            </Suspense>
          }
        />
        <Route
          path="/wajir-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Wajir profiles...</div>}>
              <Wajir />
            </Suspense>
          }
        />
        <Route
          path="/mandera-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Mandera profiles...</div>}>
              <Mandera />
            </Suspense>
          }
        />
        <Route
          path="/marsabit-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Marsabit profiles...</div>}>
              <Marsabit />
            </Suspense>
          }
        />
        <Route
          path="/isiolo-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Isiolo profiles...</div>}>
              <Isiolo />
            </Suspense>
          }
        />
        <Route
          path="/meru-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Meru profiles...</div>}>
              <Meru />
            </Suspense>
          }
        />
        <Route
          path="/tharaka-nithi-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Tharaka Nithi profiles...</div>}>
              <TharakaNithi />
            </Suspense>
          }
        />
        <Route
          path="/embu-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Embu profiles...</div>}>
              <Embu />
            </Suspense>
          }
        />
        <Route
          path="/kitui-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Kitui profiles...</div>}>
              <Kitui />
            </Suspense>
          }
        />
        <Route
          path="/machakos-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Machakos profiles...</div>}>
              <Machakos />
            </Suspense>
          }
        />
        <Route
          path="/makueni-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Makueni profiles...</div>}>
              <Makueni />
            </Suspense>
          }
        />
        <Route
          path="/nyandarua-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Nyandarua profiles...</div>}>
              <Nyandarua />
            </Suspense>
          }
        />
        <Route
          path="/nyeri-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Nyeri profiles...</div>}>
              <Nyeri />
            </Suspense>
          }
        />
        <Route
          path="/kirinyaga-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Kirinyaga profiles...</div>}>
              <Kirinyaga />
            </Suspense>
          }
        />
        <Route
          path="/muranga-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Muranga profiles...</div>}>
              <Muranga />
            </Suspense>
          }
        />
        <Route
          path="/kiambu-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Kiambu profiles...</div>}>
              <Kiambu />
            </Suspense>
          }
        />
        <Route
          path="/turkana-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Turkana profiles...</div>}>
              <Turkana />
            </Suspense>
          }
        />
        <Route
          path="/west-pokot-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading West Pokot profiles...</div>}>
              <West />
            </Suspense>
          }
        />
        <Route
          path="/samburu-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Samburu profiles...</div>}>
              <Samburu />
            </Suspense>
          }
        />
        <Route
          path="/trans-nzoia-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Trans Nzoia profiles...</div>}>
              <TransNzoia />
            </Suspense>
          }
        />
        <Route
          path="/uasin-gishu-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Uasin Gishu profiles...</div>}>
              <UasinGishu />
            </Suspense>
          }
        />
        <Route
          path="/elgeyo-marakwet-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Elgeyo Marakwet profiles...</div>}>
              <ElgeyoMarakwet />
            </Suspense>
          }
        />
        <Route
          path="/nandi-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Nandi profiles...</div>}>
              <Nandi />
            </Suspense>
          }
        />
        <Route
          path="/baringo-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Baringo profiles...</div>}>
              <Baringo />
            </Suspense>
          }
        />
        <Route
          path="/laikipia-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Laikipia profiles...</div>}>
              <Laikipia />
            </Suspense>
          }
        />
        <Route
          path="/nakuru-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Nakuru profiles...</div>}>
              <Nakuru />
            </Suspense>
          }
        />
        <Route
          path="/narok-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Narok profiles...</div>}>
              <Narok />
            </Suspense>
          }
        />
        <Route
          path="/kajiado-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Kajiado profiles...</div>}>
              <Kajiado />
            </Suspense>
          }
        />
        <Route
          path="/kericho-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Kericho profiles...</div>}>
              <Kericho />
            </Suspense>
          }
        />
        <Route
          path="/bomet-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Bomet profiles...</div>}>
              <Bomet />
            </Suspense>
          }
        />
        <Route
          path="/kakamega-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Kakamega profiles...</div>}>
              <Kakamega />
            </Suspense>
          }
        />
        <Route
          path="/vihiga-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Vihiga profiles...</div>}>
              <Vihiga />
            </Suspense>
          }
        />
        <Route
          path="/bungoma-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Bungoma profiles...</div>}>
              <Bungoma />
            </Suspense>
          }
        />
        <Route
          path="/busia-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Busia profiles...</div>}>
              <Busia />
            </Suspense>
          }
        />
        <Route
          path="/siaya-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Siaya profiles...</div>}>
              <Siaya />
            </Suspense>
          }
        />
        <Route
          path="/kisumu-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Kisumu profiles...</div>}>
              <Kisumu />
            </Suspense>
          }
        />
        <Route
          path="/homabay-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Homa Bay profiles...</div>}>
              <HomaBay />
            </Suspense>
          }
        />
        <Route
          path="/migori-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Migori profiles...</div>}>
              <Migori />
            </Suspense>
          }
        />
        <Route
          path="/kisii-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Kisii profiles...</div>}>
              <Kisii />
            </Suspense>
          }
        />
        <Route
          path="/nyamira-escorts"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading Nyamira profiles...</div>}>
              <Nyamira />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}