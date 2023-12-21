import { Dispatch, SetStateAction, createContext } from "react";

export interface ModalState {
    toggleSignUpModal: Dispatch<SetStateAction<boolean>>,
    toggleSignInModal: Dispatch<SetStateAction<boolean>>,
    toggleForgotPasswordModal: Dispatch<SetStateAction<boolean>>,
    toggleSettingModal: Dispatch<SetStateAction<boolean>>,
    modalSignUpState: boolean,
    modalSignInState: boolean,
    modalForgotPassState: boolean,
    modalSettingState: boolean
}

export const MessageModalContext = createContext<ModalState | undefined>(undefined);

export interface SubServices {
    checkBoxColor: string;
    list: Array<string>;
}
