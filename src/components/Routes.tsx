import React from "react";

import { Route } from "@tanstack/react-location";
// pages
import Login from "@app/pages/Login/Login";
import Partners from "@app/pages/Partners/Partners";
import Products from "@app/pages/Products/Products";
import ClientsPage from "@app/pages/ClientsPage/ClientsPage";
import Whouses from "@app/pages/Whouses/Whouses";
import Aboutus from "@app/pages/Aboutus/Aboutus";
import Services from "@app/pages/Services/Services";
import Authmiddleware from "./AuthMiddleware";

const routes: Route[] = [
   {
      path: '/',
      element: (
         <Authmiddleware>
            <Products />
         </Authmiddleware>
      )
   },
   {
      path: 'partners',
      element: (
         <Authmiddleware>
            <Partners />
         </Authmiddleware>
      )
   },
   {
      path: 'contacts',
      element: (
         <Authmiddleware>
            <ClientsPage />
         </Authmiddleware>
      )
   },
   {
      path: '/whouses',
      element: (
         <Authmiddleware>
            <Whouses />
         </Authmiddleware>
      )
   },
   {
      path: '/aboutus',
      element: (
         <Authmiddleware>
            <Aboutus />
         </Authmiddleware>
      )
   },
   {
      path: '/services',
      element: (
         <Authmiddleware>
            <Services />
         </Authmiddleware>
      )
   },
   {
      path: '/login',
      element: <Login />
   },

]

export default routes;