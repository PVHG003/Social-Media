import UserListModal from "@/components/chat/UserListModal";
import { createContext, useContext, useState, type ReactNode } from "react";

interface UserModalContextInterface {
  isUserListOpen: boolean;
  openUserList: () => void;
  closeUserList: () => void;
}

export const UserModalContext = createContext<
  UserModalContextInterface | undefined
>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const openUserList = () => setIsUserListOpen(true);
  const closeUserList = () => setIsUserListOpen(false);

  return (
    <UserModalContext.Provider
      value={{ isUserListOpen, openUserList, closeUserList }}
    >
      {children}
      {isUserListOpen && <UserListModal onClose={closeUserList} />}
    </UserModalContext.Provider>
  );
};

export const useUserModal = () => {
  const context = useContext(UserModalContext);
  if (!context) {
    throw new Error("useUserModal must be used within a ModalProvider");
  }
  return context;
};
