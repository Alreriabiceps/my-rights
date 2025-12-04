/**
 * Step Image Generation API Route
 * Generates visual doodles/illustrations for legal process steps
 */

import { NextResponse } from "next/server";

/**
 * Generate a simple SVG doodle based on step content
 * This creates a visual representation of the step action
 */
function generateStepDoodle(stepText, stepNumber) {
  // Extract keywords from step text to determine the visual style
  const text = stepText.toLowerCase();
  
  // Determine icon/visual style based on keywords
  let iconType = "document"; // default
  let color = "#3b82f6"; // blue
  
  if (text.includes("file") || text.includes("submit") || text.includes("lodge")) {
    iconType = "file";
    color = "#10b981"; // green
  } else if (text.includes("consult") || text.includes("lawyer") || text.includes("attorney")) {
    iconType = "consultation";
    color = "#8b5cf6"; // purple
  } else if (text.includes("gather") || text.includes("collect") || text.includes("evidence")) {
    iconType = "evidence";
    color = "#f59e0b"; // amber
  } else if (text.includes("contact") || text.includes("reach") || text.includes("call")) {
    iconType = "contact";
    color = "#ef4444"; // red
  } else if (text.includes("review") || text.includes("read") || text.includes("check")) {
    iconType = "review";
    color = "#06b6d4"; // cyan
  } else if (text.includes("prepare") || text.includes("draft") || text.includes("write")) {
    iconType = "prepare";
    color = "#ec4899"; // pink
  } else if (text.includes("meet") || text.includes("appointment") || text.includes("visit")) {
    iconType = "meeting";
    color = "#14b8a6"; // teal
  }

  // Generate SVG based on icon type
  const svgContent = generateSVGByType(iconType, stepNumber, color, stepText);
  
  return svgContent;
}

function generateSVGByType(type, stepNumber, color, stepText) {
  const width = 300;
  const height = 200;
  const padding = 20;
  
  // Base SVG structure
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad${stepNumber}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.4" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#grad${stepNumber})" rx="12"/>
    <g transform="translate(${width/2}, ${height/2})">`;

  // Generate different visuals based on type
  switch (type) {
    case "file":
      svg += `
        <rect x="-40" y="-30" width="50" height="60" fill="white" rx="4" opacity="0.9"/>
        <line x1="-15" y1="-10" x2="15" y2="-10" stroke="${color}" stroke-width="2"/>
        <line x1="-15" y1="0" x2="15" y2="0" stroke="${color}" stroke-width="2"/>
        <line x1="-15" y1="10" x2="10" y2="10" stroke="${color}" stroke-width="2"/>
        <circle cx="30" cy="-20" r="8" fill="white" opacity="0.9"/>
        <text x="30" y="-15" text-anchor="middle" font-size="12" fill="${color}" font-weight="bold">${stepNumber}</text>
      `;
      break;
      
    case "consultation":
      svg += `
        <circle cx="0" cy="-10" r="25" fill="white" opacity="0.9"/>
        <circle cx="-8" cy="-15" r="3" fill="${color}"/>
        <circle cx="8" cy="-15" r="3" fill="${color}"/>
        <path d="M -10 0 Q 0 5 10 0" stroke="${color}" stroke-width="2" fill="none"/>
        <rect x="-20" y="15" width="40" height="20" fill="white" opacity="0.9" rx="4"/>
        <text x="0" y="30" text-anchor="middle" font-size="10" fill="${color}" font-weight="bold">Step ${stepNumber}</text>
      `;
      break;
      
    case "evidence":
      svg += `
        <rect x="-35" y="-25" width="70" height="50" fill="white" opacity="0.9" rx="6"/>
        <circle cx="-15" cy="-5" r="8" fill="${color}"/>
        <circle cx="15" cy="-5" r="8" fill="${color}"/>
        <line x1="-15" y1="15" x2="15" y2="15" stroke="${color}" stroke-width="3"/>
        <text x="0" y="35" text-anchor="middle" font-size="14" fill="${color}" font-weight="bold">${stepNumber}</text>
      `;
      break;
      
    case "contact":
      svg += `
        <rect x="-30" y="-20" width="60" height="40" fill="white" opacity="0.9" rx="8"/>
        <circle cx="0" cy="0" r="12" fill="none" stroke="${color}" stroke-width="3"/>
        <path d="M -8 -8 L 8 8 M 8 -8 L -8 8" stroke="${color}" stroke-width="2"/>
        <text x="0" y="30" text-anchor="middle" font-size="14" fill="${color}" font-weight="bold">${stepNumber}</text>
      `;
      break;
      
    case "review":
      svg += `
        <rect x="-35" y="-30" width="70" height="60" fill="white" opacity="0.9" rx="6"/>
        <circle cx="0" cy="0" r="15" fill="none" stroke="${color}" stroke-width="3"/>
        <circle cx="0" cy="0" r="8" fill="${color}" opacity="0.3"/>
        <line x1="0" y1="-8" x2="0" y2="-15" stroke="${color}" stroke-width="2" marker-end="url(#arrowhead)"/>
        <text x="0" y="40" text-anchor="middle" font-size="14" fill="${color}" font-weight="bold">${stepNumber}</text>
      `;
      break;
      
    case "prepare":
      svg += `
        <rect x="-30" y="-25" width="60" height="50" fill="white" opacity="0.9" rx="6"/>
        <line x1="-20" y1="-10" x2="20" y2="-10" stroke="${color}" stroke-width="2"/>
        <line x1="-20" y1="0" x2="20" y2="0" stroke="${color}" stroke-width="2"/>
        <line x1="-20" y1="10" x2="15" y2="10" stroke="${color}" stroke-width="2"/>
        <circle cx="25" cy="-5" r="6" fill="${color}"/>
        <text x="0" y="35" text-anchor="middle" font-size="14" fill="${color}" font-weight="bold">${stepNumber}</text>
      `;
      break;
      
    case "meeting":
      svg += `
        <rect x="-40" y="-20" width="80" height="40" fill="white" opacity="0.9" rx="8"/>
        <circle cx="-15" cy="0" r="8" fill="${color}"/>
        <circle cx="15" cy="0" r="8" fill="${color}"/>
        <line x1="-15" y1="8" x2="15" y2="8" stroke="${color}" stroke-width="2"/>
        <text x="0" y="30" text-anchor="middle" font-size="14" fill="${color}" font-weight="bold">${stepNumber}</text>
      `;
      break;
      
    default: // document
      svg += `
        <rect x="-30" y="-25" width="60" height="50" fill="white" opacity="0.9" rx="4"/>
        <line x1="-20" y1="-10" x2="20" y2="-10" stroke="${color}" stroke-width="2"/>
        <line x1="-20" y1="0" x2="20" y2="0" stroke="${color}" stroke-width="2"/>
        <line x1="-20" y1="10" x2="15" y2="10" stroke="${color}" stroke-width="2"/>
        <text x="0" y="35" text-anchor="middle" font-size="14" fill="${color}" font-weight="bold">${stepNumber}</text>
      `;
  }

  svg += `</g></svg>`;
  return svg;
}

export async function POST(request) {
  try {
    const { stepText, stepNumber } = await request.json();

    if (!stepText) {
      return NextResponse.json(
        { error: "Step text is required" },
        { status: 400 }
      );
    }

    // Generate SVG doodle
    const svgDoodle = generateStepDoodle(stepText, stepNumber || 1);

    // Convert SVG to base64 data URL for easy embedding
    const base64SVG = Buffer.from(svgDoodle).toString("base64");
    const dataUrl = `data:image/svg+xml;base64,${base64SVG}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      svg: svgDoodle,
    });
  } catch (error) {
    console.error("Error generating step image:", error);
    return NextResponse.json(
      { error: "Failed to generate step image" },
      { status: 500 }
    );
  }
}

