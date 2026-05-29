import { create } from "zustand";
import { SERVER_URL } from "../config/config.js";
import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
     baseURL: SERVER_URL,
     withCredentials: true,
});

const userStore = create((set, get) => ({

     user: null,
     isLoading: false,
     isCheckingAuth: true,

     checkAuth: async () => {

          set({
               isLoading: true,
               isCheckingAuth: true,
          });

          try {

               const axiosResponse = await axiosInstance.get(
                    `/api/user/check-auth`
               );

               set({
                    user: axiosResponse.data.user,
               });

          } catch (error) {

               set({
                    user: null,
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
                    `/api/user/login`,
                    { email, password }
               );

               set({
                    user: axiosResponse.data.user,
               });

               toast.success(
                    `Welcome ${axiosResponse.data.user.fullName}`
               );

          } catch (error) {

               console.log(error);

               set({
                    user: null,
               });

               toast.error(
                    error?.response?.data?.message ||
                    "User login failed"
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
                    `/api/user/signup`,
                    { fullName, email, password }
               );

               set({
                    user: axiosResponse.data.user,
               });

               toast.success("Signup successful");

          } catch (error) {

               console.log(error);

               set({
                    user: null,
               });

               toast.error(
                    error?.response?.data?.message ||
                    "User signup failed"
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
                    `/api/user/logout`
               );

               toast.success(
                    `User logged out successfully`
               );

               set({
                    user: null,
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
                    `/api/user/resend-verification-token`,
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
                    `/api/user/verify-email`,
                    { verificationToken }
               );

               set((state) => ({
                    user: state.user
                         ? {
                                ...state.user,
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
                    `/api/user/forgot-password`,
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
                    `/api/user/reset-password/${resetPasswordToken}`,
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
                    `/api/user/update-avatar`,
                    { avatar }
               );

               set((state) => ({
                    user: {
                         ...state.user,
                         ...(axiosResponse.data.user || {}),
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

export default userStore;