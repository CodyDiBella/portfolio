import React from "react";
import Link from "next/link";
import Image from "next/image";
import aicookbookImg from "../public/assets/projects/aicookbook.jpeg";
import vanityvansImg from "../public/assets/projects/vanityvans.jpeg";
import hoglegImg from "../public/assets/projects/hogleg.jpeg";
import ogPortfolioImg from "../public/assets/projects/og.jpeg";
import ProjectItem from "./ProjectItem";

const Projects = () => {
  return (
    <div id="projects" className="w-full">
      <div className="max-w-[1240px] mx-auto px-2 py-16">
        <p className="text-xl tracking-widest uppercase text-[#7d51e5]">
          Projects
        </p>
        <h2 className="py-4">Technical Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <ProjectItem
            title="AI Cookbook"
            backgroundImg={aicookbookImg}
            projectUrl="/aicookbook"
            tools="Next.js - Supabase"
          />
          <ProjectItem
            title="vanity vans"
            backgroundImg={vanityvansImg}
            projectUrl="/vanityvans"
            tools="React-Redux - PostgreSQL"
          />
          <ProjectItem
            title="Hogwarts Legacy Character Database"
            backgroundImg={hoglegImg}
            projectUrl="/hogleg"
            tools="React - PostgreSQL"
          />
          <ProjectItem
            title="The Original Portfolio"
            backgroundImg={ogPortfolioImg}
            projectUrl="/ogPortfolio"
            tools="Built mostly with vanilla JavaScript and CSS"
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
