import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/Loginpage";
import RegisterPage from "./pages/Registerpage";
import BiensPage from "./pages/Bienspage";
import BienDetailPage from "./pages/Biensdetailpage";
import CreateBienPage from "./pages/Createbienpage";
import HomePage from "./pages/HomePage";

function AppContent() {
    const { user, logout } = useAuth();
    const [page, setPage] = useState("home"); // home | biens | detail | create | login | register
    const [selectedBienId, setSelectedBienId] = useState(null);
    const [authPage, setAuthPage] = useState("login");

    function handleSelectBien(id) {
        setSelectedBienId(id);
        setPage("detail");
    }

    if (!user) {
        return (
            <div>
                <nav className="navbar">
                    <div className="navbar-container">
                        <div className="navbar-logo">Ymmo</div>
                        <div className="navbar-menu">
                            <button className="navbar-link" onClick={() => setPage("home")}>
                                Accueil
                            </button>
                            <button className="navbar-link" onClick={() => setPage("login")}>
                                Connexion
                            </button>
                            <button className="navbar-button primary" onClick={() => setPage("register")}>
                                Inscription
                            </button>
                        </div>
                    </div>
                </nav>
                <div className="page-container">
                    {page === "home" && <HomePage onSelectBien={handleSelectBien} />}
                    {page === "detail" && <BienDetailPage bienId={selectedBienId} onBack={() => setPage("home")} />}
                    {page === "login" && (
                        <LoginPage onSwitch={() => setPage("register")} />
                    )}
                    {page === "register" && (
                        <RegisterPage onSwitch={() => setPage("login")} />
                    )}
                </div>
            </div>
        );
    }

return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">Ymmo</div>
          <div className="navbar-menu">
              <button className="navbar-link" onClick={() => setPage("biens")}>
                  Liste des biens
              </button>
              {(user.role === "commercial" || user.role === "admin") && (
                  <button className="navbar-button secondary" onClick={() => setPage("create")}>
                      + Ajouter un bien
                  </button>
              )}
          </div>
          <div className="navbar-user">
              <span className="navbar-user-info">
                Connecté : {user.prenom} {user.nom} ({user.role})
              </span>
              <button className="navbar-button logout" onClick={logout}>
                Déconnexion
              </button>
          </div>
        </div>
      </nav>
      <div className="page-container">
        {page === "biens" && <BiensPage onSelectBien={handleSelectBien} />}
        {page === "detail" && <BienDetailPage bienId={selectedBienId} onBack={() => setPage("biens")} />}
        {page === "create" && <CreateBienPage onBack={() => setPage("biens")} />}
      </div>
    </div>
);
}

export default function App() {
return (
<AuthProvider>
<AppContent />
</AuthProvider>
);
}