/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Phone,
  Briefcase,
  Target,
  Building2,
  ChevronDown,
  FileText,
  CheckCircle2,
  Loader2,
  Database,
  LayoutDashboard,
  ArrowRight,
  Globe,
  Sparkles,
  ArrowLeft,
  Download,
  Copy,
  Printer,
  Mail,
  Star,
  Map,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "motion/react";

const lenderData = [
  {
    name: "US Bank",
    category: "Commercial & Regional Bank",
    loanTypes:
      "National Bank. SBA 7(a), SBA 504, Lines of Credit, Equipment Finance, Business Diversity Lending",
    profile:
      "FICO > 680. Min 2 years in business. Min $100K+ revenue. Strong DSCR. Focus on diverse business owners.",
    geography:
      "National with heavy Northern California presence (SF, Sacramento)",
    contact:
      "866-280-3751 (Commercial) / 800-328-5371 (Equipment) | usbank.com",
  },
  {
    name: "JPMorgan Chase Bank",
    category: "Commercial & Regional Bank",
    loanTypes:
      "National Bank. SBA Express Lines and Loans, Term Loans, Commercial Real Estate",
    profile:
      "FICO > 680. Min 24 months in business. Prepayment penalties apply to loans > $250k.",
    geography: "Over 800 branches across California",
    contact: "chase.com",
  },
  {
    name: "Wells Fargo",
    category: "Commercial & Regional Bank",
    loanTypes:
      "National Bank. Term Loans, Advancing Term Loans, CRE, Asset-Based Lending",
    profile:
      "FICO > 680. Min 2 years in business. Min $25M-$2B (commercial tier) revenue. Targets middle-market revenues for commercial tiers. Strong focus on CRE.",
    geography: "San Francisco HQ, Sacramento regional offices",
    contact:
      "Heather Dennis (CRE West) / Lu Nastasiychuk | 415-801-8561 / 916-207-5565 / 800-225-5935 (Small Biz) | wellsfargo.com",
  },
  {
    name: "Bank of America",
    category: "Commercial & Regional Bank",
    loanTypes:
      "National Bank. SBA Preferred Lender (7a/504), Term Loans, Community Development",
    profile:
      "FICO > 680. Min 2 years in business. Min $100K+ revenue. Conventional bank underwriting standards. Neighborhood Lending Specialists available.",
    geography: "National, widespread Northern California branches",
    contact: "888-287-4637 | bankofamerica.com",
  },
  {
    name: "Five Star Bank",
    category: "Commercial & Regional Bank",
    loanTypes:
      "Regional Bank. SBA 7a, CalCAP Small Business, CalCAP Collateral Support",
    profile:
      "FICO > 680. Conventional regional bank standards enhanced by state CalCAP guarantees.",
    geography: "Sacramento, San Francisco, Alameda, Placer, Yolo, Sonoma",
    contact: "Ryan Chan | 916-660-5779 | fivestarbank.com",
  },
  {
    name: "Community West Bank",
    category: "Commercial & Regional Bank",
    loanTypes:
      "Regional Bank. SBA 7a, SBA 504, Conventional CRE, Equipment Financing, CalCAP",
    profile:
      "FICO > 680. Conventional underwriting parameters mitigated by state guarantee programs.",
    geography: "Fresno, Madera, Merced, San Joaquin, Sacramento, Stanislaus",
    contact: "Erin Carter | 559-323-3472 | communitywestbank.com",
  },
  {
    name: "Bank of the Orient",
    category: "Commercial & Regional Bank",
    loanTypes:
      "Regional Bank. CalCAP Small Business, CalCAP Collateral Support, Commercial Lending",
    profile:
      "Focuses on underserved and minority markets within the regional footprint.",
    geography: "San Francisco and greater Bay Area",
    contact: "Inger Li | 415-338-0602 | bankorient.com",
  },
  {
    name: "First General Bank",
    category: "Commercial & Regional Bank",
    loanTypes: "Regional Bank. SBA Lending, CalCAP Small Business",
    profile: "FICO > 680. Standard regional commercial banking parameters.",
    geography: "Northern and Southern California footprint",
    contact: "Tony Chan | 626-820-1099 x138 | fgbusa.com",
  },
  {
    name: "United Business Bank",
    category: "Commercial & Regional Bank",
    loanTypes:
      "Regional Bank. Quick Qualifier Program (QQP), CalCAP, SBA Lending",
    profile:
      "FICO > 680. Target market includes low-to-moderate income census tracts.",
    geography: "Sacramento, SF, Santa Clara, Alameda, Contra Costa",
    contact:
      "Blanca Palmer / Peter Kim | 949-486-8769 / 714-736-5714 | unitedbusinessbank.com",
  },
  {
    name: "Mega Bank",
    category: "Commercial & Regional Bank",
    loanTypes: "Regional Bank. SBA 7a, SBA 504, CalCAP Small Business",
    profile:
      "FICO > 680. Commercial underwriting with an emphasis on SBA enhancements.",
    geography: "Broad California presence",
    contact: "Joseph Jung | 626-382-152 | megabankusa.com",
  },
  {
    name: "Murphy Bank",
    category: "Commercial & Regional Bank",
    loanTypes: "Regional Bank. Small Business Lending, CalCAP",
    profile: "FICO > 680. Regional commercial credit metrics.",
    geography: "Central Valley footprint",
    contact: "Jose Herrera | 559-225-0318 | murphybank.com",
  },
  {
    name: "First Pacific Bank",
    category: "Commercial & Regional Bank",
    loanTypes:
      "Regional Bank. Small Business Lending, CalCAP Collateral Support",
    profile: "FICO > 680. Regional commercial credit metrics.",
    geography: "California Statewide",
    contact: "Carlos Salazar | 657-348-9657 | firstpacbank.com",
  },
  {
    name: "1st Northern California Credit Union",
    category: "Credit Union",
    loanTypes:
      "State-Chartered CU. Commercial Real Estate, Equipment, Business Vehicles",
    profile:
      "FICO > 650. Min 1-2 years in business. FICO ~650-680+. Relational underwriting. DFPI Regulated.",
    geography: "Martinez, Contra Costa County",
    contact: "David Green | 888-387-8636 | 1stnorcalcu.org",
  },
  {
    name: "1st United Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Term Loans, Business Lines of Credit",
    profile: "FICO > 680. Relational underwriting. DFPI Regulated.",
    geography: "Pleasanton, Alameda County",
    contact: "Stephen Stone | 925-598-4750",
  },
  {
    name: "Valley First Credit Union",
    category: "Credit Union",
    loanTypes:
      "State-Chartered CU. SBA 7(a), SBA 504, Conventional CRE, Equipment, Microloans, CalCAP",
    profile: "FICO > 650. Flexible underwriting, community focused.",
    geography: "Modesto, Sacramento, San Joaquin, Fresno, Tulare, Tuolumne",
    contact: "Raymond McCaslin / Kathryn Davis | 209-303-1778 / 209-549-8500",
  },
  {
    name: "Coast Central Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Regional business lending, SBA linkages",
    profile: "FICO > 650. Member-focused regional lending. DFPI Regulated.",
    geography: "Eureka, Humboldt County, North Coast",
    contact: "James Sessa | 707-445-8801",
  },
  {
    name: "Community First Credit Union",
    category: "Credit Union",
    loanTypes:
      "State-Chartered CU. Local business loans, commercial real estate",
    profile:
      "FICO > 650. Community focused relational underwriting. DFPI Regulated.",
    geography: "Santa Rosa, Sonoma County",
    contact: "Scott E. Johnson | 707-546-6000",
  },
  {
    name: "San Francisco Fire CU",
    category: "Credit Union",
    loanTypes:
      "State-Chartered CU. Small business loans, specialized equipment",
    profile: "FICO > 650. Relational underwriting. DFPI Regulated.",
    geography: "San Francisco",
    contact: "Kathy Duvall | 415-674-4800",
  },
  {
    name: "Sierra Central Credit Union",
    category: "Credit Union",
    loanTypes:
      "State-Chartered CU. Business checking, CRE, agricultural linkages",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Yuba City, Sutter and Yuba Counties",
    contact: "Ron Sweeney | 800-222-7228",
  },
  {
    name: "Vision One Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Independent professional practice lending",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Sacramento",
    contact: "Kenneth Ferreira | 916-363-4293",
  },
  {
    name: "Compass Community Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. SME financing, working capital",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Arcata, Humboldt County",
    contact: "Ray Litchfield | 707-443-8662",
  },
  {
    name: "Commonwealth Central Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Regional business financing",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "San Jose, Santa Clara County",
    contact: "Viktoria Earle | 408-531-3100",
  },
  {
    name: "North Bay Credit Union",
    category: "Credit Union",
    loanTypes:
      "State-Chartered CU. Regional business financing, agricultural support",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Santa Rosa, Sonoma County",
    contact: "Darlene Brown | 707-584-0384",
  },
  {
    name: "Star One Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Tech-centric regional business lending",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Sunnyvale, Santa Clara County",
    contact: "Minal Gupta | 408-543-5202",
  },
  {
    name: "Bay Cities Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. SME financing, working capital",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Hayward, Alameda County",
    contact: "Georgette Munoz | 510-690-6100",
  },
  {
    name: "Atchison Village Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Localized small business lending",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Richmond, Contra Costa County",
    contact: "Cecilia Heredia-Rocha | 510-233-3218",
  },
  {
    name: "Technology Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Regional business financing",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "San Jose, Santa Clara County",
    contact: "Todd Harris | 408-451-9111",
  },
  {
    name: "Travis Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Regional business financing",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Vacaville, Solano County",
    contact: "Kevin Miller | 800-877-8328",
  },
  {
    name: "UNCLE Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Regional business financing",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Livermore, Alameda County",
    contact: "Harold Roundtree | 925-447-5001",
  },
  {
    name: "United Association Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Regional business financing",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Concord, Contra Costa County",
    contact: "Rawnie Thomas | 925-686-1044",
  },
  {
    name: "C.A.H.P. Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Localized SME financing",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Sacramento",
    contact: "Audrey Pappas | 916-362-4191",
  },
  {
    name: "California Community Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Localized SME financing",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Sacramento",
    contact: "Marcy Cole-King | 916-386-1418",
  },
  {
    name: "Central State Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Localized SME financing",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Stockton, San Joaquin County",
    contact: "Paul Kramer | 209-444-5300",
  },
  {
    name: "Meriwest Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Regional business financing",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "San Jose, Santa Clara County",
    contact: "Lisa Pesta | 408-972-5222",
  },
  {
    name: "Monterra Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Regional business financing",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Redwood City, San Mateo County",
    contact: "Wade Painter | 650-363-1725",
  },
  {
    name: "Pacific Service Credit Union",
    category: "Credit Union",
    loanTypes: "State-Chartered CU. Regional business financing",
    profile: "FICO > 650. DFPI Regulated.",
    geography: "Concord, Contra Costa County",
    contact: "Jenna Lampson | 925-609-5000",
  },
  {
    name: "Golden 1 Credit Union",
    category: "Credit Union",
    loanTypes: "Regional CU. Community lending, business accounts",
    profile: "FICO > 650. Broad community lending.",
    geography: "Sacramento HQ / California Statewide",
    contact: "golden1.com",
  },
  {
    name: "Sacramento Credit Union",
    category: "Credit Union",
    loanTypes: "Regional CU. Regional lending",
    profile: "FICO > 650. Highly rated regional lending.",
    geography: "Sacramento",
    contact: "",
  },
  {
    name: "San Francisco Credit Union",
    category: "Credit Union",
    loanTypes: "Regional CU. Regional lending",
    profile: "FICO > 650. Highly rated regional lending.",
    geography: "San Francisco",
    contact: "",
  },
  {
    name: "Working Solutions CDFI",
    category: "CDFI & Mission-Driven",
    loanTypes:
      "CDFI / Non-Profit. Affordable Microloans, Startups, CalCAP Collateral Support",
    profile:
      "$5k-$100k. Holistic underwriting without strict minimum FICO. Focus on systemically underfinanced communities.",
    geography: "20+ NorCal Counties (Alameda, SF, Sacramento, Marin, etc.)",
    contact: "Gasper Magallanes | 415-655-5448 | workingsolutions.org",
  },
  {
    name: "Pacific Community Ventures",
    category: "CDFI & Mission-Driven",
    loanTypes:
      "Mission-Driven Lender. Small Business Loans, Expansion, Equipment",
    profile:
      "Min 12 months in business. No minimum credit score requirement. Provides free business advising.",
    geography: "California Statewide",
    contact: "pacificcommunityventures.org/small-business-loans/",
  },
  {
    name: "North Edge Financing",
    category: "CDFI & Mission-Driven",
    loanTypes: "SBA Microlender. SBA Microloans (Affiliate of Arcata EDC)",
    profile: "Alternative credit metrics, strong technical assistance.",
    geography: "Eureka, Humboldt County, North Coast",
    contact: "Kelli | 707-798-6132 | northedgefinancing.org",
  },
  {
    name: "TMC Community Capital",
    category: "CDFI & Mission-Driven",
    loanTypes: "CDFI / Non-Profit. Micro-lending, CalCAP Small Business",
    profile:
      "$5k-$50k+. Focuses on underserved populations, specifically female entrepreneurs.",
    geography: "Northern California / Statewide",
    contact: "Vasana Ly | 415-655-5419 | tmccommunitycapital.org",
  },
  {
    name: "Global Finance CDFI, LLC",
    category: "CDFI & Mission-Driven",
    loanTypes: "CDFI. IBank SBLGP, CalCAP, ZEHDI (Zero Emission)",
    profile:
      "$50k-$6.25M. Responsible financial products for underserved communities.",
    geography: "California Statewide",
    contact: "Steve Zuck | 714-421-5485 | globalcdfi.com",
  },
  {
    name: "Lendistry, LLC",
    category: "CDFI & Mission-Driven",
    loanTypes: "Minority-Led CDFI. Term Loans, Grant Administration, CalCAP",
    profile:
      "$25k-$5M. Flexible alternative underwriting with higher risk tolerance than traditional banks.",
    geography: "California Statewide",
    contact: "Kent Monfore | 562-475-4103 | lendistry.com",
  },
  {
    name: "Economic Development & Financing Corp (EDFC)",
    category: "CDFI & Mission-Driven",
    loanTypes:
      "Economic Development Corp. Small Business, CalCAP Collateral Support",
    profile:
      "Varied loan sizes. Focuses heavily on rural economic development and localized business retention.",
    geography: "Lake and Mendocino Counties",
    contact: "Robert Gernert | 707-234-5705 | edfc.org",
  },
  {
    name: "Opening Doors",
    category: "CDFI & Mission-Driven",
    loanTypes: "Non-Profit Microlender. SBA Microloans, CalCAP",
    profile:
      "Startups and micro-enterprises. Emphasizes immigrant and refugee economic integration.",
    geography: "El Dorado, Placer, Sacramento, Yolo",
    contact: "916-492-2591 | openingdoorsinc.org",
  },
  {
    name: "Main Street Launch",
    category: "CDFI & Mission-Driven",
    loanTypes: "CDFI. SBA Microloans, Community Advantage Loans",
    profile:
      "Focus on diverse business owners and commercial corridor revitalization.",
    geography: "SF Bay Area, Oakland",
    contact: "mainstreetlaunch.org",
  },
  {
    name: "Fresno Area Hispanic Foundation (Access Plus Capital)",
    category: "CDFI & Mission-Driven",
    loanTypes: "CDFI. Microloans, CalCAP Collateral Support",
    profile:
      "Serves the Central San Joaquin Valley. Focus on Hispanic and minority-owned enterprises.",
    geography: "Fresno, Central Valley",
    contact: "Yeng Her | 559-552-4318 | accesspluscapital.com",
  },
  {
    name: "California FarmLink",
    category: "CDFI & Mission-Driven",
    loanTypes: "CDFI. Agricultural Microloans",
    profile:
      "Focuses on independent farmers, sustainable agriculture, and rural food systems.",
    geography: "Northern and Central California",
    contact: "",
  },
  {
    name: "Accion Opportunity Fund",
    category: "CDFI & Mission-Driven",
    loanTypes: "CDFI. Microloans, Term Loans, CalCAP",
    profile:
      "Flexible underwriting for low-to-moderate income business owners.",
    geography: "California Statewide",
    contact: "866-299-8173 | aofund.org",
  },
  {
    name: "RSF Social Finance",
    category: "CDFI & Mission-Driven",
    loanTypes: "Mission-Driven Lender. Secured Debt Loans, CalCAP, ZEHDV",
    profile:
      "$500k-$5M. Focuses on food/agriculture, climate/energy, and education impact areas.",
    geography: "California Statewide",
    contact: "Michael Jones | 415-561-6195 | rsfsocialfinance.org",
  },
  {
    name: "Apoyo Financiero Inc.",
    category: "CDFI & Mission-Driven",
    loanTypes: "CDFI. Micro-lending",
    profile: "Focuses on the unbanked Hispanic community.",
    geography: "Concord / East Bay",
    contact: "",
  },
  {
    name: "California Capital FDC",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes:
      "Financial Development Corporation. IBank State Loan Guarantees, California Loan Match Program, Direct Lending, Technical Assistance",
    profile:
      "Translates high-risk entrepreneurial endeavors into secure, bankable assets via guarantees.",
    geography:
      "Sacramento, Stockton, Yuba City, Yolo, Nevada, Placer, El Dorado",
    contact: "Robert Gonzales | 805-450-5736 | cacapital.org",
  },
  {
    name: "Nor-Cal Financial Development Corp.",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes:
      "Financial Development Corporation. Facilitates IBank Loan Guarantees, connects borrowers with commercial banks",
    profile: "Risk mitigation for commercial lenders.",
    geography: "Oakland, San Francisco Bay Area",
    contact: "510-698-2080",
  },
  {
    name: "California Coastal Rural Development Corp.",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes:
      "Financial Development Corporation. Agricultural and rural business guarantees, commercial linkages",
    profile: "Agricultural and rural business focus.",
    geography: "Salinas, Santa Cruz, Monterey, Central Coast",
    contact: "831-424-1099",
  },
  {
    name: "Valley Small Business Development Corp.",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes:
      "Financial Development Corporation. IBank Guarantees, agricultural lending support",
    profile: "Agricultural lending support.",
    geography: "Fresno, Hanford, Central San Joaquin Valley",
    contact: "559-438-9680",
  },
  {
    name: "3CORE",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes: "CalCAP PFI / Economic Development. Small Business Lending",
    profile: "Economic development focus.",
    geography: "Butte, Glenn, Tehama Counties",
    contact: "Patty Hess | 530-893-8732 x203 | 3coreedc.org",
  },
  {
    name: "Crossroads Equipment Lease & Finance",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes:
      "CalCAP PFI / Equipment Financier. CalCAP Small Business, Collateral Support, ZEHDV",
    profile:
      "Specialized equipment financing utilizing state guarantee programs.",
    geography: "California Statewide",
    contact: "Missy Gomez | 909-477-0179 | crlease.com",
  },
  {
    name: "Isuzu Finance of America, Inc.",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes:
      "CalCAP PFI / Equipment Financier. CalCAP Collateral Support, ZEHDV. Commercial vehicle financing and leasing.",
    profile: "Commercial vehicle financing.",
    geography: "California Statewide",
    contact: "Jim DeFrank | 914-960-6691 | isuzufin.com",
  },
  {
    name: "Verdant Commercial Capital LLC",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes:
      "CalCAP PFI / Equipment Financier. CalCAP Small Business, Collateral Support, ZEHDV",
    profile: "Equipment financing.",
    geography: "California Statewide",
    contact: "Josh Patton | 586-201-9699 | verdantcc.com",
  },
  {
    name: "VFS US LLC (Volvo Financial)",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes:
      "CalCAP PFI / Equipment Financier. Financing for Volvo Group trucks and construction equipment, ZEHDV",
    profile: "Volvo Group product financing.",
    geography: "California Statewide",
    contact: "Michael Drane | 919-328-0352 | volvofinancialservices.com/us/",
  },
  {
    name: "Regions Bank (Ascentium Capital)",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes:
      "CalCAP PFI. Term loans, leases, working capital, ZEHDV, Collateral Support",
    profile: "Broad equipment and working capital financing.",
    geography: "California Statewide",
    contact: "Stephen Interlicchio | 281-902-1999 | ascentiumcapital.com",
  },
  {
    name: "SLIM Capital LLC",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes: "CalCAP PFI. Small Business, Collateral Support, ZEHDV",
    profile: "",
    geography: "California Statewide",
    contact: "Shervin Rashti | 310-499-2506 | slimcapital.com",
  },
  {
    name: "Innovative Lease Services, Inc.",
    category: "State-Supported (CalCAP/FDC)",
    loanTypes:
      "CalCAP PFI. Equipment leasing, Small Business, Collateral Support",
    profile: "Equipment leasing specialist.",
    geography: "California Statewide",
    contact: "Nora Nere | 800-438-1470 x104 | ilslease.com/equipment-lease/",
  },
  {
    name: "Capital Access Group",
    category: "SBA 504 CDC",
    loanTypes:
      "Certified Development Company. SBA 504 exclusively (Heavy fixed assets, CRE)",
    profile:
      "Min Net worth < $20M revenue. Net worth < $20M; Net income < $6.5M. Focus on job creation and facility acquisition.",
    geography: "San Francisco HQ, serving NorCal",
    contact: "J. Jordan | 415-217-7600 | jjordan@capitalaccess.com",
  },
  {
    name: "Bay Area Employment Development Co.",
    category: "SBA 504 CDC",
    loanTypes: "Certified Development Company. SBA 504 exclusively",
    profile:
      "Min Net worth < $20M revenue. Expertise in heavy machinery and commercial real estate transactions.",
    geography: "Concord, serving SF Bay Area and East Bay",
    contact: "R. Grant | 925-926-1020 | RGrant@baydevco.com",
  },
  {
    name: "Advantage CDC",
    category: "SBA 504 CDC",
    loanTypes: "Certified Development Company. SBA 504 exclusively",
    profile:
      "Min Net worth < $20M revenue. Coordinates with regional banking partners to assemble the 50/40/10 structure.",
    geography: "Statewide reach with Northern California operations",
    contact: "A. Shafique | 562-983-7450 | ashafique@advantagecdc.org",
  },
  {
    name: "Arcata Economic Development Corp (AEDC)",
    category: "SBA 504 CDC",
    loanTypes: "CDC / CDFI dual designation. SBA 504, Community Lending",
    profile:
      "Min Net worth < $20M revenue. Specialized focus on rural economic development and industrial expansion.",
    geography: "Eureka, Humboldt County, and the broader North Coast",
    contact: "Kelli | 707-798-6132 | kelli@northedgefinancing.org",
  },
  {
    name: "Hercules Capital",
    category: "Private Equity & Venture Debt",
    loanTypes: "Venture Debt. Senior Secured Loans ($5M+)",
    profile:
      "Technology, Life Sciences. Targets high-growth companies backed by top-tier VC.",
    geography: "Palo Alto / SF Bay Area",
    contact: "htgc.com",
  },
  {
    name: "Customers Bank (Tech & Venture Group)",
    category: "Private Equity & Venture Debt",
    loanTypes: "Venture Bank. Venture Debt, Equipment Financing ($2M-$100M)",
    profile:
      "Startups, SaaS, recurring revenue models. Must possess compelling business plan and VC backing.",
    geography: "Palo Alto",
    contact: "customersbank.com",
  },
  {
    name: "Banc of California",
    category: "Private Equity & Venture Debt",
    loanTypes:
      "Venture Bank. Venture Banking, Fund Finance, Corporate Asset Finance",
    profile:
      "Technology, Life Sciences, Seed/Early Stage innovators. Non-dilutive working capital lines.",
    geography: "California Statewide",
    contact: "bancofcal.com",
  },
  {
    name: "San Francisco Equity Partners",
    category: "Private Equity & Venture Debt",
    loanTypes:
      "Private Equity. Growth Equity, Control / Significant Minority Buyouts ($15M-$40M)",
    profile:
      "Min $15M-$100M revenue revenue. Consumer Brands, Pet Care, F&B. Targets $3M-$15M EBITDA.",
    geography: "San Francisco",
    contact: "sfequitypartners.com",
  },
  {
    name: "Sonoma Brands Capital",
    category: "Private Equity & Venture Debt",
    loanTypes:
      "Private Equity. Minority & Control Equity Investments ($5M-$30M)",
    profile:
      "Min $5M+ sales revenue. Consumer packaged goods, wellness, beauty, omnichannel retail.",
    geography: "Sonoma",
    contact: "hello@sonomabrands.com | sonomabrands.com",
  },
  {
    name: "CORE Industrial Partners",
    category: "Private Equity & Venture Debt",
    loanTypes: "Private Equity. Buyouts, Growth Capital",
    profile:
      "Lower-middle market manufacturing, industrial technology, and industrial service businesses.",
    geography: "Broad Northern California reach",
    contact: "coreipfund.com",
  },
  {
    name: "TSG Consumer Partners",
    category: "Private Equity & Venture Debt",
    loanTypes: "Private Equity. Growth Equity, Buyouts",
    profile:
      "Consumer brands, beauty, personal care, e-commerce, food and beverage.",
    geography: "San Francisco",
    contact: "tsgconsumer.com",
  },
  {
    name: "NextWorld Evergreen",
    category: "Private Equity & Venture Debt",
    loanTypes: "Private Equity. Long-term evergreen growth equity",
    profile: "Mission-driven consumer brands, clean beauty, specialty retail.",
    geography: "San Francisco",
    contact: "nextworld.com",
  },
  {
    name: "Encore Consumer Capital",
    category: "Private Equity & Venture Debt",
    loanTypes: "Private Equity. Lower middle-market consumer focus",
    profile: "Consumer products and services, manufacturing scaling.",
    geography: "San Francisco",
    contact: "encoreconsumer.com",
  },
  {
    name: "Central Valley Fund (CVF Capital Partners)",
    category: "Private Equity & Venture Debt",
    loanTypes:
      "Private Equity / Mezzanine. Subordinated Debt, Preferred Equity",
    profile:
      "Small and medium-sized Main Street businesses requiring flexible capital solutions.",
    geography: "Davis, Sacramento region",
    contact: "cvfcapitalpartners.com",
  },
  {
    name: "Fundbox",
    category: "Alternative & FinTech",
    loanTypes:
      "Online Algorithmic Lender. Short-term Lines of Credit, Term Loans",
    profile:
      "FICO > 600. Min 6 months in business. Min $100K+ revenue. Repayment terms of 12, 24, or 52 weeks. No prepayment penalties. 1-5 day funding.",
    geography: "Online / Available Statewide",
    contact: "fundbox.com",
  },
  {
    name: "QuickBooks Capital",
    category: "Alternative & FinTech",
    loanTypes: "Platform Lender. Term Loans ($1.5k-$200k)",
    profile:
      "FICO > 580. Leverages existing QuickBooks accounting data for rapid algorithmic approval. 6-24 month terms.",
    geography: "Online / Available Statewide",
    contact: "quickbooks.intuit.com",
  },
  {
    name: "Lendio",
    category: "Alternative & FinTech",
    loanTypes:
      "Lending Marketplace / Aggregator. SBA loans, LOC, Term loans, Equipment, Factoring",
    profile:
      "Functions as an aggregator, matching diverse credit profiles with a network of alternative and traditional lenders.",
    geography: "Online / Available Statewide",
    contact: "lendio.com",
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Commercial & Regional Bank":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Credit Union":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CDFI & Mission-Driven":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "State-Supported":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "SBA 504 CDC":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "Private Equity & Venture Debt":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "Alternative & FinTech":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const LenderCard = ({ lender }: { lender: any }) => (
  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full group">
    <div className="p-8 flex-1 flex flex-col">
      <div className="mb-6">
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider uppercase border ${getCategoryColor(lender.category)}`}
        >
          {lender.category}
        </span>
      </div>
      <h3 className="text-2xl font-black text-slate-900 leading-tight mb-6 group-hover:text-blue-600 transition-colors">
        {lender.name}
      </h3>

      <div className="space-y-6 flex-1">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Loan Types
            </p>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              {lender.loanTypes}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
            <Target className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Target Profile
            </p>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              {lender.profile}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Geographic Focus
            </p>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              {lender.geography}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 mt-auto">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
          <Phone className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
            Contact
          </p>
          <p className="text-sm font-bold text-slate-900">{lender.contact}</p>
        </div>
      </div>
    </div>
  </div>
);

const CompactLenderCard = ({
  lender,
  onDraftEmail,
  isDrafting,
  showDraftButton = true,
}: {
  lender: any;
  onDraftEmail?: (lender: any) => void;
  isDrafting?: boolean;
  showDraftButton?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="mb-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase border ${getCategoryColor(lender.category)}`}
            >
              {lender.category}
            </span>
          </div>
          <h4 className="text-xl font-black text-slate-900">{lender.name}</h4>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-center"
          >
            {isExpanded ? "Less Info" : "More Info"}
          </button>
          {showDraftButton && onDraftEmail && (
            <button
              onClick={() => onDraftEmail(lender)}
              disabled={isDrafting}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDrafting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              Draft Pitch
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Loan Types
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {lender.loanTypes}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Target Profile
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {lender.profile}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Geographic Focus
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {lender.geography}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-3 pt-4 border-t border-slate-200/60">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Contact
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {lender.contact}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Helper Components ---

const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase border ${className}`}
  >
    {children}
  </span>
);

const MinimalInput = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
}: any) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-[11px] font-black tracking-widest uppercase text-slate-500 ml-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      className="w-full bg-slate-50/50 border-2 border-slate-100 px-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all text-slate-900 font-medium placeholder-slate-300"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const MinimalSelect = ({ label, id, value, onChange, options }: any) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-[11px] font-black tracking-widest uppercase text-slate-500 ml-1"
    >
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        className="w-full bg-slate-50/50 border-2 border-slate-100 px-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all text-slate-900 font-medium appearance-none cursor-pointer"
        value={value}
        onChange={onChange}
      >
        <option value="" disabled className="text-slate-400">
          Select an option...
        </option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

function AssessmentTool({
  lenderData,
  onBack,
}: {
  lenderData: any[];
  onBack: () => void;
}) {
  const [formData, setFormData] = useState({
    industry: "",
    timeInBusiness: "",
    revenue: "",
    creditScore: "",
    loanAmount: "",
    loanPurpose: "",
    narrative: "",
    websiteUrl: "",
  });
  const [isAssessing, setIsAssessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [draftingLender, setDraftingLender] = useState<string | null>(null);
  const [selectedLenderForEmail, setSelectedLenderForEmail] =
    useState<any>(null);
  const [assessmentResult, setAssessmentResult] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const recommendedLenders = useMemo(() => {
    if (!assessmentResult) return [];
    return lenderData.filter((lender) =>
      assessmentResult.includes(lender.name),
    );
  }, [assessmentResult, lenderData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(assessmentResult);
    alert("Report copied to clipboard!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([assessmentResult], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = "SBDC_Capital_Assessment.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDraftEmail = async (lender: any) => {
    setDraftingLender(lender.name);
    setSelectedLenderForEmail(lender);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const prompt = `
Based on the following client profile and assessment report, draft a professional, concise "Banker Pitch Email" that the SBDC advisor or the client can send to ${lender.name} to initiate a conversation.

Client Profile:
- Industry: ${formData.industry}
- Time in Business: ${formData.timeInBusiness}
- Revenue: ${formData.revenue}
- Loan Amount: $${formData.loanAmount}
- Purpose: ${formData.loanPurpose}
- Narrative: ${formData.narrative}

Lender Profile (${lender.name}):
- Target Profile: ${lender.profile}
- Loan Types: ${lender.loanTypes}

Assessment Report Context:
${assessmentResult}

Draft the email with a clear subject line. Keep it professional, persuasive, and focused on how the business aligns with ${lender.name}'s specific lending profile. Do not include PII placeholders other than [Client Name], [Business Name], and [Lender Contact Name].
`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setEmailDraft(response.text || "");

      // Update analytics stats
      localStorage.setItem(
        "stats_emails",
        (parseInt(localStorage.getItem("stats_emails") || "0") + 1).toString(),
      );

      setTimeout(() => {
        document
          .getElementById("email-draft-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      console.error(err);
      alert("Failed to draft email.");
    } finally {
      setDraftingLender(null);
    }
  };

  const handleScanWebsite = async () => {
    if (!formData.websiteUrl) {
      setError("Please enter a website URL to scan.");
      return;
    }
    setIsScanning(true);
    setError("");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const prompt = `Scan the business website at ${formData.websiteUrl} and write a 2-3 sentence pitch summary explaining what the business does, its target market, and its value proposition. This will be used for a loan application narrative. Do not include any PII.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ urlContext: {} }],
        },
      });

      setFormData((prev) => ({ ...prev, narrative: response.text || "" }));
    } catch (err: any) {
      console.error(err);
      setError(
        "Failed to scan website. Please try writing the narrative manually.",
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleAssess = async () => {
    if (
      !formData.timeInBusiness ||
      !formData.revenue ||
      !formData.creditScore ||
      !formData.loanAmount
    ) {
      setError(
        "Please fill in all required fields (Time in Business, Revenue, Credit Score, Loan Amount).",
      );
      return;
    }

    setIsAssessing(true);
    setError("");
    setAssessmentResult("");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

      const prompt = `
You are an expert SBDC (Small Business Development Center) capital advisor. Your goal is to help match a small business client with the most appropriate lenders from our database based on their profile.

Client Profile:
- Industry/Sector: ${formData.industry || "Not specified"}
- Time in Business: ${formData.timeInBusiness}
- Annual Revenue: ${formData.revenue}
- Estimated Credit Score (FICO): ${formData.creditScore}
- Loan Amount Requested: $${formData.loanAmount}
- Purpose of Loan: ${formData.loanPurpose || "Not specified"}
- Narrative/Additional Details: ${formData.narrative || "None provided"}

Available Lenders Database:
${JSON.stringify(lenderData, null, 2)}

Task:
1. Analyze the client's profile against the underwriting criteria (FICO, time in business, revenue, loan types) of the lenders in the database.
2. Identify the top 3 to 5 most appropriate lender matches.
3. For each match, explain exactly *why* they are a good fit and any potential hurdles the client might face with that specific lender. **CRITICAL: You must use the EXACT name of the lender as it appears in the database so our system can link to their profile.**
4. Provide a "Review and Next Steps" section for the SBDC advisor. This should include specific recommendations on how the advisor can help the client prepare for these applications (e.g., documents to gather, narrative to refine, credit score improvements needed).

Format your response in clean, professional Markdown. Use headings, bullet points, and bold text for readability. Do not include any PII.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAssessmentResult(response.text || "No response generated.");

      // Update analytics stats
      localStorage.setItem(
        "stats_assessments",
        (
          parseInt(localStorage.getItem("stats_assessments") || "0") + 1
        ).toString(),
      );
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "An error occurred while generating the assessment.",
      );
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12 relative"
    >
      <Target className="absolute -left-20 top-20 w-96 h-96 text-slate-900 opacity-[0.02] pointer-events-none" />

      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={onBack}
          className="p-3 bg-white hover:bg-slate-100 text-slate-600 rounded-full transition-colors shadow-sm border border-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Capital Assessment
          </h2>
          <p className="text-slate-500">
            Generate an AI-powered match report for your client.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Form Section */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <MinimalInput
                id="industry"
                label="Industry / Sector"
                value={formData.industry}
                onChange={(e: any) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                placeholder="e.g. Manufacturing, Retail, Tech"
              />

              <MinimalSelect
                id="timeInBusiness"
                label="Time in Business *"
                value={formData.timeInBusiness}
                onChange={(e: any) =>
                  setFormData({ ...formData, timeInBusiness: e.target.value })
                }
                options={[
                  {
                    value: "Startup (< 6 months)",
                    label: "Startup (< 6 months)",
                  },
                  { value: "6-12 months", label: "6-12 months" },
                  { value: "1-2 years", label: "1-2 years" },
                  { value: "2+ years", label: "2+ years" },
                ]}
              />

              <MinimalSelect
                id="revenue"
                label="Annual Revenue *"
                value={formData.revenue}
                onChange={(e: any) =>
                  setFormData({ ...formData, revenue: e.target.value })
                }
                options={[
                  { value: "Pre-revenue", label: "Pre-revenue" },
                  { value: "< $100k", label: "< $100k" },
                  { value: "$100k - $500k", label: "$100k - $500k" },
                  { value: "$500k - $1M", label: "$500k - $1M" },
                  { value: "$1M+", label: "$1M+" },
                ]}
              />

              <MinimalInput
                id="creditScore"
                type="number"
                label="Est. Credit Score *"
                value={formData.creditScore}
                onChange={(e: any) =>
                  setFormData({ ...formData, creditScore: e.target.value })
                }
                placeholder="e.g. 680"
              />

              <MinimalInput
                id="loanAmount"
                type="number"
                label="Loan Amount *"
                value={formData.loanAmount}
                onChange={(e: any) =>
                  setFormData({ ...formData, loanAmount: e.target.value })
                }
                placeholder="e.g. 50000"
              />

              <MinimalSelect
                id="loanPurpose"
                label="Purpose of Loan"
                value={formData.loanPurpose}
                onChange={(e: any) =>
                  setFormData({ ...formData, loanPurpose: e.target.value })
                }
                options={[
                  { value: "Working Capital", label: "Working Capital" },
                  { value: "Equipment Purchase", label: "Equipment Purchase" },
                  {
                    value: "Real Estate Acquisition",
                    label: "Real Estate Acquisition",
                  },
                  {
                    value: "Business Acquisition",
                    label: "Business Acquisition",
                  },
                  { value: "Debt Refinance", label: "Debt Refinance" },
                ]}
              />

              <div className="pt-6 mt-6 border-t border-slate-100">
                <label className="block text-[11px] font-black tracking-widest uppercase text-slate-500 ml-1 mb-2">
                  Auto-Fill Narrative
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all text-sm font-medium placeholder-slate-300"
                      placeholder="https://client-website.com"
                      value={formData.websiteUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, websiteUrl: e.target.value })
                      }
                    />
                  </div>
                  <button
                    onClick={handleScanWebsite}
                    disabled={isScanning || !formData.websiteUrl}
                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    {isScanning ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    )}
                    Scan
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-2">
                <label
                  htmlFor="narrative"
                  className="text-[11px] font-black tracking-widest uppercase text-slate-500 ml-1"
                >
                  Short Narrative
                </label>
                <textarea
                  id="narrative"
                  className="w-full bg-slate-50/50 border-2 border-slate-100 px-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all min-h-[120px] resize-y text-slate-900 font-medium placeholder-slate-300"
                  placeholder="Brief description of the business and capital needs..."
                  value={formData.narrative}
                  onChange={(e) =>
                    setFormData({ ...formData, narrative: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => {
                    setFormData({
                      industry: "",
                      timeInBusiness: "",
                      revenue: "",
                      creditScore: "",
                      loanAmount: "",
                      loanPurpose: "",
                      narrative: "",
                      websiteUrl: "",
                    });
                    setAssessmentResult("");
                    setError("");
                  }}
                  disabled={isAssessing}
                  className="text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50 px-2"
                >
                  Clear form
                </button>
                <button
                  onClick={handleAssess}
                  disabled={isAssessing}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isAssessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Generate Matches
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 min-h-[600px] h-full relative overflow-hidden flex flex-col">
            <FileText className="absolute -right-20 -bottom-20 w-96 h-96 text-slate-900 opacity-[0.02] pointer-events-none" />

            {assessmentResult ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 flex-1 flex flex-col"
              >
                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Assessment Report
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Copy to Clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Download Markdown"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Print Report"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-li:marker:text-blue-500 mb-12">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {assessmentResult}
                  </Markdown>
                </div>

                {/* Recommended Lenders List */}
                {recommendedLenders.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-6">
                      Recommended Lenders
                    </h3>
                    <div className="flex flex-col gap-4">
                      {recommendedLenders.map((lender, idx) => (
                        <CompactLenderCard
                          key={idx}
                          lender={lender}
                          onDraftEmail={handleDraftEmail}
                          isDrafting={draftingLender === lender.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Email Draft Section */}
                {emailDraft && (
                  <div
                    id="email-draft-section"
                    className="bg-slate-50 rounded-2xl p-8 border border-slate-200 mt-auto"
                  >
                    <div className="flex items-start justify-between gap-6 mb-6">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">
                          Pitch Email: {selectedLenderForEmail?.name}
                        </h4>
                        <p className="text-slate-500 text-sm">
                          Review and copy the generated email draft below.
                        </p>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative"
                    >
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(emailDraft);
                          alert("Email draft copied!");
                        }}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy Email"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <div className="prose prose-sm prose-slate max-w-none">
                        <Markdown>{emailDraft}</Markdown>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
                  <p>
                    <strong>Disclaimer:</strong> This tool provides automated
                    recommendations based on general underwriting criteria and
                    does not guarantee loan approval. SBDC advisors should use
                    their professional judgment when advising clients.
                  </p>
                </div>
              </motion.div>
            ) : isAssessing ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6 py-24 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <Loader2 className="w-16 h-16 animate-spin text-blue-600 relative z-10" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900 mb-2">
                    Evaluating Criteria...
                  </p>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Our AI is analyzing the client profile against the
                    underwriting standards of all lenders in the database.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6 py-24 relative z-10">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900 mb-2">
                    Ready for Assessment
                  </p>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Fill out the client profile on the left and click "Generate
                    Matches" to see recommended lenders and next steps.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnalyticsPortal({ lenderData }: { lenderData: any[] }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ assessments: 0, emails: 0 });

  useEffect(() => {
    setStats({
      assessments: parseInt(localStorage.getItem("stats_assessments") || "0"),
      emails: parseInt(localStorage.getItem("stats_emails") || "0"),
    });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Bingbang555" || password === "Bingbang!555") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-6 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 pointer-events-none" />
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full relative z-10">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
            <LayoutDashboard className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
            Analytics Portal
          </h2>
          <p className="text-slate-500 mb-8 font-medium">
            Enter the password to access the analytics dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative bg-slate-50 rounded-lg border-b-2 border-slate-200 focus-within:border-blue-600 focus-within:bg-slate-100 transition-all">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent px-4 py-4 focus:outline-none text-slate-900 font-medium placeholder-slate-400"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button
              type="submit"
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              Access Portal
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12"
    >
      <div className="mb-10">
        <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
          Analytics Dashboard
        </h2>
        <p className="text-xl text-slate-500">
          Overview of tool usage and lender matching statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
            Total Assessments
          </p>
          <p className="text-5xl font-black text-slate-900 tracking-tighter">
            {stats.assessments}
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
            Active Lenders
          </p>
          <p className="text-5xl font-black text-slate-900 tracking-tighter">
            {lenderData.length}
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
            Pitch Emails Drafted
          </p>
          <p className="text-5xl font-black text-slate-900 tracking-tighter">
            {stats.emails}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-96 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <LayoutDashboard className="w-16 h-16 mx-auto mb-6 opacity-30" />
          <p className="text-lg font-bold text-slate-500 mb-2">
            Detailed analytics charts will appear here.
          </p>
          <p className="text-sm font-medium">
            Connect to your backend database to populate real-time metrics.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState<
    "home" | "database" | "assessment" | "analytics"
  >("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDbLender, setSelectedDbLender] = useState<any>(null);
  const [savedLenders, setSavedLenders] = useState<string[]>([]);

  // Quick Pitch State
  const [quickPitchData, setQuickPitchData] = useState({
    industry: "",
    revenue: "",
    loanAmount: "",
    narrative: "",
  });
  const [isDraftingQuickPitch, setIsDraftingQuickPitch] = useState(false);
  const [quickPitchResult, setQuickPitchResult] = useState("");

  // Load saved lenders
  useEffect(() => {
    const saved = localStorage.getItem("saved_lenders");
    if (saved) setSavedLenders(JSON.parse(saved));
  }, []);

  const toggleSaveLender = (lenderName: string) => {
    const newSaved = savedLenders.includes(lenderName)
      ? savedLenders.filter((n) => n !== lenderName)
      : [...savedLenders, lenderName];
    setSavedLenders(newSaved);
    localStorage.setItem("saved_lenders", JSON.stringify(newSaved));
  };

  const handleQuickPitch = async (lender: any) => {
    if (!quickPitchData.industry || !quickPitchData.loanAmount) {
      alert("Please fill in at least the Industry and Loan Amount.");
      return;
    }
    setIsDraftingQuickPitch(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const prompt = `
Draft a professional, concise "Banker Pitch Email" to ${lender.name}.

Client Profile:
- Industry: ${quickPitchData.industry}
- Revenue: ${quickPitchData.revenue || "Not specified"}
- Loan Amount: $${quickPitchData.loanAmount}
- Narrative: ${quickPitchData.narrative || "Not specified"}

Lender Profile (${lender.name}):
- Target Profile: ${lender.profile}
- Loan Types: ${lender.loanTypes}

Keep it professional, persuasive, and focused on how the business aligns with ${lender.name}'s specific lending profile. Do not include PII placeholders other than [Client Name], [Business Name], and [Lender Contact Name].
`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setQuickPitchResult(response.text || "");
      localStorage.setItem(
        "stats_emails",
        (parseInt(localStorage.getItem("stats_emails") || "0") + 1).toString(),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to draft pitch.");
    } finally {
      setIsDraftingQuickPitch(false);
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = new Set(lenderData.map((l) => l.category));
    return Array.from(uniqueCategories).sort();
  }, []);

  const filteredLenders = useMemo(() => {
    return lenderData.filter((lender) => {
      const matchesCategory =
        selectedCategory === "All Categories" ||
        lender.category === selectedCategory;
      const searchLower = searchTerm.toLowerCase().trim();

      // Basic text match
      let matchesSearch =
        lender.name.toLowerCase().includes(searchLower) ||
        lender.loanTypes.toLowerCase().includes(searchLower) ||
        lender.profile.toLowerCase().includes(searchLower) ||
        lender.geography.toLowerCase().includes(searchLower);

      // Zip code logic (mocking Northern California zip codes)
      if (!matchesSearch && /^\d{5}$/.test(searchLower)) {
        const zip = parseInt(searchLower, 10);
        const isNorCalZip = zip >= 93000 && zip <= 96199;
        const isSacramentoZip = zip >= 95600 && zip <= 95899;
        const isBayAreaZip = zip >= 94000 && zip <= 95199;

        const geoLower = lender.geography.toLowerCase();

        if (
          isNorCalZip &&
          (geoLower.includes("northern california") ||
            geoLower.includes("statewide") ||
            geoLower.includes("national") ||
            geoLower.includes("california"))
        ) {
          matchesSearch = true;
        }
        if (isSacramentoZip && geoLower.includes("sacramento")) {
          matchesSearch = true;
        }
        if (
          isBayAreaZip &&
          (geoLower.includes("san francisco") ||
            geoLower.includes("bay area") ||
            geoLower.includes("sf"))
        ) {
          matchesSearch = true;
        }
      }

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveView("home")}
          >
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-black tracking-tight text-xl">
              NorCal SBDC
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveView("database")}
              className={`text-sm font-bold transition-colors ${activeView === "database" ? "text-blue-600" : "text-slate-500 hover:text-slate-900"}`}
            >
              Database
            </button>
            <button
              onClick={() => setActiveView("assessment")}
              className={`text-sm font-bold transition-colors ${activeView === "assessment" ? "text-blue-600" : "text-slate-500 hover:text-slate-900"}`}
            >
              Assessment
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        <AnimatePresence mode="wait">
          {activeView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative min-h-[calc(100vh-80px)] flex items-center"
            >
              {/* Background gradient & icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/50 pointer-events-none" />
              <Database className="absolute -right-40 top-1/2 -translate-y-1/2 w-[800px] h-[800px] text-slate-900 opacity-[0.02] pointer-events-none transform -rotate-12" />

              <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10 w-full py-20">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs tracking-widest uppercase mb-8 border border-blue-100">
                    <Sparkles className="w-4 h-4" />
                    Capital Readiness Tool
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.95]">
                    Match clients with
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      the right capital.
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed mb-12 font-medium">
                    An intelligent platform for SBDC advisors to assess client
                    readiness and navigate the Northern California lending
                    landscape.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setActiveView("assessment")}
                      className="px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Sparkles className="w-6 h-6" />
                      Start New Assessment
                    </button>
                    <button
                      onClick={() => setActiveView("database")}
                      className="px-8 py-5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-lg transition-all flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Database className="w-6 h-6 text-slate-400" />
                      Browse Database
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeView === "database" && (
            <motion.div
              key="database"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex flex-col"
            >
              <div className="mb-6 flex-shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                    Lender Directory
                  </h2>
                  <p className="text-slate-500 font-medium">
                    Browse, filter, and pitch our curated network of lending
                    partners.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:max-w-xl">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search lenders, regions, or loan types..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all text-slate-900 placeholder:text-slate-400 font-medium text-sm shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative w-full sm:w-48">
                    <select
                      className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all text-slate-900 font-bold text-sm cursor-pointer shadow-sm"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="All Categories">All Categories</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Master-Detail Split Pane */}
              <div className="flex-1 flex gap-6 min-h-0 relative">
                {/* Left Pane: List */}
                <div className={`w-full lg:w-[400px] xl:w-[450px] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-shrink-0 transition-all ${selectedDbLender ? 'hidden lg:flex' : 'flex'}`}>
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <span className="text-xs font-black tracking-widest uppercase text-slate-400">
                      {filteredLenders.length} Results
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {filteredLenders.length > 0 ? (
                      filteredLenders.map((lender, idx) => {
                        const isSelected =
                          selectedDbLender?.name === lender.name;
                        const isSaved = savedLenders.includes(lender.name);
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedDbLender(lender);
                              setQuickPitchResult("");
                            }}
                            className={`p-4 rounded-xl cursor-pointer transition-all border ${isSelected ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <Badge
                                className={getCategoryColor(lender.category)}
                              >
                                {lender.category}
                              </Badge>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveLender(lender.name);
                                }}
                                className={`p-1.5 rounded-md transition-colors ${isSaved ? "text-yellow-500 bg-yellow-50" : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"}`}
                              >
                                <Star
                                  className="w-4 h-4"
                                  fill={isSaved ? "currentColor" : "none"}
                                />
                              </button>
                            </div>
                            <h4
                              className={`text-lg font-black mb-1 ${isSelected ? "text-blue-900" : "text-slate-900"}`}
                            >
                              {lender.name}
                            </h4>
                            <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed mb-3">
                              {lender.loanTypes}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">
                                {lender.geography.split(",")[0]}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-20 px-4">
                        <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">
                          No lenders match your criteria.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Pane: Detail */}
                <div className={`flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-col ${selectedDbLender ? 'flex' : 'hidden lg:flex'}`}>
                  {selectedDbLender ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {/* Header */}
                      <div className="p-6 lg:p-8 border-b border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 pointer-events-none" />
                        <div className="relative z-10">
                          <button 
                            onClick={() => setSelectedDbLender(null)}
                            className="lg:hidden mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900"
                          >
                            <ArrowLeft className="w-4 h-4" /> Back to List
                          </button>
                          <div className="flex items-center gap-3 mb-4">
                            <Badge
                              className={getCategoryColor(
                                selectedDbLender.category,
                              )}
                            >
                              {selectedDbLender.category}
                            </Badge>
                            {savedLenders.includes(selectedDbLender.name) && (
                              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Saved
                              </Badge>
                            )}
                          </div>
                          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                            {selectedDbLender.name}
                          </h2>
                          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />{" "}
                              {selectedDbLender.geography}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-4 h-4" />{" "}
                              {selectedDbLender.contact.split("|")[0]}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-12">
                        {/* Details Column */}
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 mb-3 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" /> Loan Products
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedDbLender.loanTypes
                                .split(/[,.]/)
                                .map((type: string, i: number) => {
                                  const t = type.trim();
                                  if (!t) return null;
                                  return (
                                    <span
                                      key={i}
                                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700"
                                    >
                                      {t}
                                    </span>
                                  );
                                })}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 mb-3 flex items-center gap-2">
                              <Target className="w-4 h-4" /> Target Profile &
                              Underwriting
                            </h3>
                            <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-5 rounded-xl border border-slate-100">
                              {selectedDbLender.profile}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 mb-3 flex items-center gap-2">
                              <Map className="w-4 h-4" /> Coverage Area
                            </h3>
                            <div className="bg-slate-900 rounded-xl p-5 text-white relative overflow-hidden">
                              <MapPin className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
                              <p className="font-bold relative z-10">
                                {selectedDbLender.geography}
                              </p>
                              <p className="text-slate-400 text-sm mt-1 relative z-10">
                                Services this region actively.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Quick Pitch Column */}
                        <div>
                          <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6">
                            <div className="mb-6">
                              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-1">
                                <Sparkles className="w-5 h-5 text-blue-600" />{" "}
                                Quick Pitch Generator
                              </h3>
                              <p className="text-sm text-slate-500 font-medium">
                                Draft a customized email to{" "}
                                {selectedDbLender.name} instantly.
                              </p>
                            </div>

                            {!quickPitchResult ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <MinimalInput
                                    id="qp-industry"
                                    label="Industry *"
                                    value={quickPitchData.industry}
                                    onChange={(e: any) =>
                                      setQuickPitchData({
                                        ...quickPitchData,
                                        industry: e.target.value,
                                      })
                                    }
                                  />
                                  <MinimalInput
                                    id="qp-amount"
                                    label="Amount *"
                                    type="number"
                                    value={quickPitchData.loanAmount}
                                    onChange={(e: any) =>
                                      setQuickPitchData({
                                        ...quickPitchData,
                                        loanAmount: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <MinimalInput
                                  id="qp-revenue"
                                  label="Annual Revenue"
                                  value={quickPitchData.revenue}
                                  onChange={(e: any) =>
                                    setQuickPitchData({
                                      ...quickPitchData,
                                      revenue: e.target.value,
                                    })
                                  }
                                />
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[11px] font-black tracking-widest uppercase text-slate-500 ml-1">
                                    Short Narrative
                                  </label>
                                  <textarea
                                    className="w-full bg-white border-2 border-slate-100 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 text-sm font-medium min-h-[80px] resize-y"
                                    placeholder="Brief business description..."
                                    value={quickPitchData.narrative}
                                    onChange={(e: any) =>
                                      setQuickPitchData({
                                        ...quickPitchData,
                                        narrative: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <button
                                  onClick={() =>
                                    handleQuickPitch(selectedDbLender)
                                  }
                                  disabled={isDraftingQuickPitch}
                                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                                >
                                  {isDraftingQuickPitch ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                  ) : (
                                    <Mail className="w-5 h-5" />
                                  )}
                                  Generate Pitch Email
                                </button>
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                  <span className="text-xs font-bold text-slate-500">
                                    Draft Ready
                                  </span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        quickPitchResult,
                                      );
                                      alert("Copied!");
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1"
                                  >
                                    <Copy className="w-3 h-3" /> Copy
                                  </button>
                                </div>
                                <div className="p-4 prose prose-sm prose-slate max-w-none max-h-[300px] overflow-y-auto custom-scrollbar">
                                  <Markdown>{quickPitchResult}</Markdown>
                                </div>
                                <div className="p-3 bg-slate-50 border-t border-slate-100">
                                  <button
                                    onClick={() => setQuickPitchResult("")}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                                  >
                                    ← Start Over
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                        <Building2 className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">
                        Select a Lender
                      </h3>
                      <p className="text-slate-500 font-medium max-w-sm">
                        Choose a lender from the directory on the left to view
                        their full profile, underwriting criteria, and generate
                        a custom pitch.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === "assessment" && (
            <AssessmentTool
              lenderData={lenderData}
              onBack={() => setActiveView("home")}
            />
          )}

          {activeView === "analytics" && (
            <AnalyticsPortal lenderData={lenderData} />
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-center md:text-left font-medium">
            <p className="mb-1 text-slate-300">
              Built by Norcal SBDC Marketing
            </p>
            <p>
              Questions? Aaron Phelps |{" "}
              <a
                href="mailto:marketing@norcalsbdc.org"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                marketing@norcalsbdc.org
              </a>
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3 text-sm">
            <button
              onClick={() => setActiveView("analytics")}
              className="text-slate-500 hover:text-white transition-colors font-bold uppercase tracking-wider text-[10px]"
            >
              Analytics Portal
            </button>
            <p className="text-slate-600 text-xs font-medium">
              &copy; {new Date().getFullYear()} NorCal SBDC. All rights
              reserved. v1.2.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
