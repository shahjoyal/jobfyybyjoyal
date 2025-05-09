import { Outlet, redirect, useNavigate, useNavigation } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Dashboard';
import { BigSidebar, Navbar, SmallSidebar, Loading } from '../components';
import { createContext, useContext, useEffect, useState } from 'react';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { checkDefaultTheme } from '../App';
const userQuery = {
  queryKey: ['user'],
  queryFn: async () => {
    const { data } = await customFetch.get('/users/current-user');
    return data;
  },
};

export const loader = (queryClient) => async () => {
  try {
    return await queryClient.ensureQueryData(userQuery);
  } catch (error) {
    return redirect('/');
  }
};

const DashboardContext = createContext();

const DashboardLayout = ({ queryClient }) => {
  const { user } = useQuery(userQuery).data;
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
  const [isAuthError, setIsAuthError] = useState(false);

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme', newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    navigate('/');
    await customFetch.get('/auth/logout');
    queryClient.invalidateQueries();
    toast.success('Logging out...');
  };

  customFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        setIsAuthError(true);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (!isAuthError) return;
    logoutUser();
  }, [isAuthError]);

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className='dashboard'>
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className='dashboard-page'>
              {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};
export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
// import { Outlet,useLoaderData } from 'react-router-dom';
// import Wrapper from '../assets/wrappers/Dashboard';
// import BigSidebar from '../components/BigSidebar';
// import Navbar from '../components/Navbar';
// import SmallSidebar from '../components/SmallSidebar';
// import { useState, createContext, useContext } from 'react';
// import { customFetch } from '../utils/customFetch';
// import { redirect } from 'react-router-dom';

// // export const loader = async () => {
// //   try {
// //     const { data } = await customFetch('/users/current-user');
// //     return data;
// //   } catch (error) {
// //     return redirect('/');
// //   }
// // };

// const DashboardContext = createContext();
// const Dashboard = () => {
//   const { user } = useLoaderData();

//   const [showSidebar, setShowSidebar] = useState(false);
//   const [isDarkTheme, setIsDarkTheme] = useState(false);

//   const toggleDarkTheme = () => {
//     const newDarkTheme = !isDarkTheme;
//     setIsDarkTheme(newDarkTheme);
//     document.body.classList.toggle('dark-theme', newDarkTheme);
//     localStorage.setItem('darkTheme', newDarkTheme);
//   };

//   const toggleSidebar = () => {
//     setShowSidebar(!showSidebar);
//   };

//   const logoutUser = async () => {
//     console.log('logout user');
//   };
//   return (
//     <DashboardContext.Provider
//       value={{
//         user,
//         showSidebar,
//         isDarkTheme,
//         toggleDarkTheme,
//         toggleSidebar,
//         logoutUser,
//       }}
//     >
//       <Wrapper>
//         <main className='dashboard'>
//           <SmallSidebar />
//           <BigSidebar />
//           <div>
//             <Navbar />
//             <div className='dashboard-page'>
//               <Outlet  />
//             </div>
//           </div>
//         </main>
//       </Wrapper>
//     </DashboardContext.Provider>
//   );
// };

// export const useDashboardContext = () => useContext(DashboardContext);

// export default Dashboard;