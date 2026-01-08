import { connectDB } from '../lib/db.js';
import Contact from '../models/Contact.js';
import Service from '../models/Service.js';
import Content from '../models/Content.js';

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Connect to database and sync models
    await connectDB();
    
    // Seed initial services data (optional)
    const existingServices = await Service.count();
    
    if (existingServices === 0) {
      console.log('📦 Seeding initial services...');
      
      const services = [
        {
          title: 'Strategy Consulting',
          subtitle: 'Define Your Competitive Edge',
          description: "In today's rapidly evolving markets, strategy isn't just about planning—it's about building adaptable frameworks that respond to change while maintaining focus on long-term objectives.",
          icon: 'TrendingUp',
          capabilities: [
            'Corporate & Business Unit Strategy',
            'Market Entry & Expansion Planning',
            'Competitive Positioning',
            'Strategic Partnerships & M&A Advisory',
            'Scenario Planning & Risk Assessment',
          ],
          serviceData: {
            title: 'Strategy Consulting',
            subtitle: 'Define Your Competitive Edge',
            description: "In today's rapidly evolving markets, strategy isn't just about planning—it's about building adaptable frameworks that respond to change while maintaining focus on long-term objectives.",
            icon: 'TrendingUp',
            capabilities: [
              'Corporate & Business Unit Strategy',
              'Market Entry & Expansion Planning',
              'Competitive Positioning',
              'Strategic Partnerships & M&A Advisory',
              'Scenario Planning & Risk Assessment',
            ],
          },
          order: 1,
          isActive: true,
        },
        {
          title: 'Business Transformation',
          subtitle: 'Navigate Change with Confidence',
          description: "Transformation initiatives fail when execution doesn't match ambition. We guide organizations through complex change programs, ensuring lasting impact across technology, culture, and operations.",
          icon: 'RefreshCw',
          capabilities: [
            'Digital Transformation',
            'Organizational Restructuring',
            'Change Management',
            'Culture & Leadership Development',
            'Post-Merger Integration',
          ],
          serviceData: {
            title: 'Business Transformation',
            subtitle: 'Navigate Change with Confidence',
            description: "Transformation initiatives fail when execution doesn't match ambition. We guide organizations through complex change programs, ensuring lasting impact across technology, culture, and operations.",
            icon: 'RefreshCw',
            capabilities: [
              'Digital Transformation',
              'Organizational Restructuring',
              'Change Management',
              'Culture & Leadership Development',
              'Post-Merger Integration',
            ],
          },
          order: 2,
          isActive: true,
        },
        {
          title: 'Operational Excellence',
          subtitle: 'Maximize Efficiency & Quality',
          description: "Operational excellence isn't about cutting corners—it's about creating systems that deliver consistently superior results while eliminating waste and reducing costs.",
          icon: 'Settings',
          capabilities: [
            'Process Optimization & Automation',
            'Supply Chain Transformation',
            'Cost Reduction Programs',
            'Quality Management Systems',
            'Performance Management',
          ],
          serviceData: {
            title: 'Operational Excellence',
            subtitle: 'Maximize Efficiency & Quality',
            description: "Operational excellence isn't about cutting corners—it's about creating systems that deliver consistently superior results while eliminating waste and reducing costs.",
            icon: 'Settings',
            capabilities: [
              'Process Optimization & Automation',
              'Supply Chain Transformation',
              'Cost Reduction Programs',
              'Quality Management Systems',
              'Performance Management',
            ],
          },
          order: 3,
          isActive: true,
        },
        {
          title: 'Growth & Expansion',
          subtitle: 'Scale with Strategic Precision',
          description: 'Growth requires more than ambition. We help organizations identify opportunities, build capabilities, and execute expansion strategies that deliver sustainable results.',
          icon: 'Expand',
          capabilities: [
            'New Market Entry',
            'Product & Service Innovation',
            'Revenue Optimization',
            'Customer Experience Enhancement',
            'Channel Strategy & Development',
          ],
          serviceData: {
            title: 'Growth & Expansion',
            subtitle: 'Scale with Strategic Precision',
            description: 'Growth requires more than ambition. We help organizations identify opportunities, build capabilities, and execute expansion strategies that deliver sustainable results.',
            icon: 'Expand',
            capabilities: [
              'New Market Entry',
              'Product & Service Innovation',
              'Revenue Optimization',
              'Customer Experience Enhancement',
              'Channel Strategy & Development',
            ],
          },
          order: 4,
          isActive: true,
        },
      ];
      
      await Service.bulkCreate(services);
      console.log('✅ Services seeded successfully');
    } else {
      console.log('ℹ️  Services already exist, skipping seed');
    }
    
    console.log('✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();

