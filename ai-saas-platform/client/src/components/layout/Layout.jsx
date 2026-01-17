import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 px-6 py-8 bg-gray-50">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
