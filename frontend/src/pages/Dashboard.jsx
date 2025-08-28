import React, { useState } from "react";
import API from "../api";
import { Briefcase, MessageSquare, Compass, MapPin, CheckSquare, Settings2 } from "lucide-react";

const OpportunityCard = ({ title, skills, ngo, location, status, id }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
    <div className="flex items-start justify-between mb-4">
      <span className="text-sm text-gray-500">NGO ID: {id}</span>
      <span className="text-sm font-semibold text-green-600 px-3 py-1 bg-green-100 rounded-full">
        {location}
      </span>
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 mb-4">{ngo}</p>
    <div className="text-xs text-gray-500 space-y-1 mb-4">
      <div className="flex items-center">
        <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
        <span>{skills}</span>
      </div>
      <div className="flex items-center">
        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
        <span>{location}</span>
      </div>
      <div className="flex items-center">
        <CheckSquare className="w-4 h-4 mr-1 text-gray-400" />
        <span>{status}</span>
      </div>
    </div>
    <div className="flex justify-end">
      <button className="px-6 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200">
        Apply
      </button>
    </div>
  </div>
);

const OpportunitiesView = () => (
  <div id="opportunities-view">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold text-gray-900">Volunteering Opportunities</h2>
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search opportunities..."
          className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <OpportunityCard
        id="2"
        title="Translation of Educational Materials"
        ngo="Translate educational materials from English to Spanish, French, or Arabic to support our global literacy programs."
        skills="Translation, Language Skills"
        location="Remote"
        status="Ongoing"
      />
      <OpportunityCard
        id="2"
        title="Website Redesign for Local Shelter"
        ngo="Help us redesign our website to improve our online presence and reach more potential adopters."
        skills="Web Development, Design"
        location="New York, NY"
        status="2-3 weeks"
      />
      <OpportunityCard
        id="1"
        title="Fundraising Gala Event Coordinator"
        ngo="Help plan and coordinate our annual fundraising gala to support children's medical research."
        skills="Event Planning, Marketing"
        location="Chicago, IL"
        status="6 months"
      />
    </div>
  </div>
);

const MessagesView = () => (
  <div id="messages-view" className="flex flex-col h-full">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Messages</h2>
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm font-semibold text-blue-800">Test NGO</p>
          <p className="text-xs text-gray-500">5/4/2025</p>
          <p className="mt-2 text-sm text-gray-700">
            Hello! I noticed you have web development skills. We're looking for help with our
            Translation of Educational Materials project.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-sm font-semibold text-gray-800">NYC Animal Rescue</p>
          <p className="text-xs text-gray-500">5/4/2025</p>
          <p className="mt-2 text-sm text-gray-700">
            Hello! I'm interested in your Website Redesign project.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeView, setActiveView] = useState("opportunities");

  const renderView = () => {
    switch (activeView) {
      case "opportunities":
        return <OpportunitiesView />;
      case "messages":
        return <MessagesView />;
      default:
        return <OpportunitiesView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="flex-shrink-0 w-64 bg-white border-r border-gray-200 rounded-tr-3xl rounded-br-3xl overflow-y-auto shadow-lg p-6 flex flex-col">
        <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6">
          <h1 className="text-2xl font-bold text-blue-600">SkillBridge</h1>
        </div>
        <nav className="space-y-2 mb-6">
          <button
            onClick={() => setActiveView("opportunities")}
            className={`flex items-center space-x-3 w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeView === "opportunities"
                ? "text-blue-600 bg-blue-100 hover:bg-blue-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>Volunteering Opportunities</span>
          </button>
          <button
            onClick={() => setActiveView("messages")}
            className={`flex items-center space-x-3 w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeView === "messages"
                ? "text-blue-600 bg-blue-100 hover:bg-blue-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </button>
        </nav>

        {/* Filters */}
        <div className="flex-grow space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <p className="text-sm text-gray-500">Find opportunities that match your skills</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
            <h3 className="text-sm font-semibold mb-2">Skills</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search skills"
                className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Settings2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
            <h3 className="text-sm font-semibold mb-2">Location</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search locations"
                className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
            <h3 className="text-sm font-semibold mb-2">Status</h3>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="open" className="text-blue-600 rounded-md focus:ring-blue-500" />
              <label htmlFor="open" className="text-sm text-gray-700">
                Open
              </label>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <input type="checkbox" id="ongoing" className="text-blue-600 rounded-md focus:ring-blue-500" />
              <label htmlFor="ongoing" className="text-sm text-gray-700">
                Ongoing
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button className="w-full py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200">
              Reset Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">{renderView()}</main>
    </div>
  );
}
