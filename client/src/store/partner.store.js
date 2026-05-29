import { create } from "zustand";
import { SERVER_URL } from "../config/config.js";
import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
     baseURL: SERVER_URL,
     withCredentials: true,
});

const partnerStore = create((set, get) => ({

     partner: null,
     isLoading: false,
     isCheckingAuth: true,

     checkAuth: async () => {

          set({
               isLoading: true,
               isCheckingAuth: true,
          });

          try {

               const axiosResponse = await axiosInstance.get(
                    `/api/partner/check-auth`
               );

               

               set({
                    partner: axiosResponse.data.partner,
               });

          } catch (error) {

               set({
                    partner: null,
               });

          } finally {
               
               set({
                    isLoading: false,
                    isCheckingAuth: false,
               });

          }
     },

     login: async ({ email, password }) => {

          set({ isLoading: true });

          try {

               const axiosResponse = await axiosInstance.post(
                    `/api/partner/login`,
                    { email, password }
               );

               set({
                    partner: axiosResponse.data.partner,
               });

               toast.success(
                    `Welcome ${axiosResponse.data.partner.fullName}`
               );

          } catch (error) {

               console.log(error);

               set({
                    partner: null,
               });

               toast.error(
                    error?.response?.data?.message ||
                    "Partner login failed"
               );

          } finally {

               set({
                    isLoading: false,
               });

          }
     },

     signup: async ({ fullName, email, password }) => {

          set({ isLoading: true });

          try {

               const axiosResponse = await axiosInstance.post(
                    `/api/partner/signup`,
                    { fullName, email, password }
               );

               set({
                    partner: axiosResponse.data.partner,
               });

               toast.success("Signup successful");

          } catch (error) {

               console.log(error);

               set({
                    partner: null,
               });

               toast.error(
                    error?.response?.data?.message ||
                    "Partner signup failed"
               );

          } finally {

               set({
                    isLoading: false,
               });

          }
     },

     logout: async () => {

          set({ isLoading: true });

          try {

               await axiosInstance.get(
                    `/api/partner/logout`
               );

               toast.success(
                    `${get()?.partner?.fullName || "Partner"} logged out successfully`
               );

               set({
                    partner: null,
               });

          } catch (error) {

               console.log(error);

               toast.error(
                    error?.response?.data?.message ||
                    "Logout failed"
               );

          } finally {

               set({
                    isLoading: false,
               });

          }
     },

     resendVerificationToken: async ({ email }) => {

          set({ isLoading: true });

          try {

               await axiosInstance.post(
                    `/api/partner/resend-verification-token`,
                    { email }
               );

               toast.success(
                    "Verification token sent to email"
               );

          } catch (error) {

               console.log(error);

               toast.error(
                    error?.response?.data?.message ||
                    "Failed to resend verification token"
               );

          } finally {

               set({
                    isLoading: false,
               });

          }
     },

     verifyEmail: async ({ verificationToken }) => {

          set({ isLoading: true });

          try {

               await axiosInstance.post(
                    `/api/partner/verify-email`,
                    { verificationToken }
               );

               set((state) => ({
                    partner: state.partner
                         ? {
                                ...state.partner,
                                verified: true,
                           }
                         : null,
               }));

               toast.success(
                    "Email verified successfully"
               );

          } catch (error) {

               console.log(error);

               toast.error(
                    error?.response?.data?.message ||
                    "Email verification failed"
               );

          } finally {

               set({
                    isLoading: false,
               });

          }
     },

     forgotPassword: async ({ email }) => {

          set({ isLoading: true });

          try {

               await axiosInstance.post(
                    `/api/partner/forgot-password`,
                    { email }
               );

               toast.success(
                    "Reset link sent to email"
               );

          } catch (error) {

               console.log(error);

               toast.error(
                    error?.response?.data?.message ||
                    "Forgot password failed"
               );

          } finally {

               set({
                    isLoading: false,
               });

          }
     },

     resetPassword: async ({ password, resetPasswordToken }) => {

          set({ isLoading: true });

          try {

               await axiosInstance.post(
                    `/api/partner/reset-password/${resetPasswordToken}`,
                    { password }
               );

               toast.success(
                    "Password reset successfully"
               );

          } catch (error) {

               console.log(error);

               toast.error(
                    error?.response?.data?.message ||
                    "Password reset failed"
               );

          } finally {

               set({
                    isLoading: false,
               });

          }
     },

     updateAvatar: async ({ avatar }) => {

          set({ isLoading: true });

          try {

               const axiosResponse = await axiosInstance.post(
                    `/api/partner/update-avatar`,
                    { avatar }
               );

               set((state) => ({
                    partner: {
                         ...state.partner,
                         ...(axiosResponse.data.partner || {}),
                    }
               }));

               toast.success(
                    "Avatar updated successfully"
               );

          } catch (error) {

               console.log(error);

               toast.error(
                    error?.response?.data?.message ||
                    "Avatar update failed"
               );

          } finally {

               set({
                    isLoading: false,
               });

          }
     },

}));

export default partnerStore;