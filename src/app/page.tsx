"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HeroDemo } from "@/components/landing/HeroDemo";
import { LearningLoop } from "@/components/landing/LearningLoop";
import { GuidanceComparison } from "@/components/landing/GuidanceComparison";
import { HintLadder } from "@/components/landing/HintLadder";
import { TutorStates } from "@/components/landing/TutorStates";
import { ProblemTrace } from "@/components/landing/ProblemTrace";
import { LearningPath } from "@/components/landing/LearningPath";
import { Personalization } from "@/components/landing/Personalization";
import { ProgressMetric } from "@/components/landing/ProgressMetric";
import { Comparison } from "@/components/landing/Comparison";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="relative bg-floral text-smoky min-h-screen selection:bg-bone selection:text-smoky overflow-x-hidden">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Hero Header */}
      <div id="product">
        <Hero />
      </div>

      {/* Hero Product Demonstration */}
      <HeroDemo />

      {/* Section 10: The Broken Learning Loop */}
      <LearningLoop />

      {/* Section 11: The Difference Between Hint and Guidance */}
      <GuidanceComparison />

      {/* Section 12: Progressive Guidance Signature Section */}
      <HintLadder />

      {/* Section 13: One Tutor, Different States */}
      <TutorStates />

      {/* Section 14: Problem Trace Timeline */}
      <div id="about">
        <ProblemTrace />
      </div>

      {/* Section 15: Algorithm Learning Path */}
      <LearningPath />

      {/* Section 16: Personalization & Reasoning Memory */}
      <Personalization />

      {/* Section 17: Guidance Dependency Visual Metric */}
      <ProgressMetric />

      {/* Section 18: Feature Matrix Comparison */}
      <Comparison />

      {/* Section 19: Final CTA */}
      <FinalCTA />

      {/* Section 20: Footer */}
      <Footer />
    </div>
  );
}
