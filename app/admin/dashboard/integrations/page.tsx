'use client';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const integrations = [
  {
    name: 'Mixpanel',
    description: 'Analytics tracking and user behavior insights',
    url: 'https://mixpanel.com',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  {
    name: 'Supabase',
    description: 'Database, authentication, and backend infrastructure',
    url: 'https://app.supabase.com',
    color: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200'
  },
  {
    name: 'Google Tag Manager Console',
    description: 'Tag management and deployment',
    url: 'https://tagmanager.google.com',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  {
    name: 'GTM Tag Assistant',
    description: 'Debug and validate GTM implementation',
    url: 'https://tagassistant.google.com',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  {
    name: 'Mapbox',
    description: 'Maps and location services',
    url: 'https://account.mapbox.com',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200'
  },
  {
    name: 'Resend',
    description: 'Transactional email service',
    url: 'https://resend.com/overview',
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  {
    name: 'GitHub',
    description: 'Code repository and version control',
    url: 'https://github.com/rentsmallspace/rentsmallspace-next',
    color: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200'
  },
  {
    name: 'Vercel',
    description: 'Hosting and deployment platform',
    url: 'https://vercel.com/dashboard',
    color: 'bg-black',
    textColor: 'text-white',
    borderColor: 'border-gray-600'
  },
  {
    name: 'GoDaddy',
    description: 'Domain management and DNS settings',
    url: 'https://dcc.godaddy.com/domains',
    color: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  }
];

export default function IntegrationsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Integrations & Resources</h1>
        <p className="mt-2 text-sm text-gray-600">
          Quick access to all third-party services and tools used by RentSmallSpace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <a
            key={integration.name}
            href={integration.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative p-6 border rounded-lg transition-all duration-200 hover:shadow-md ${integration.color} ${integration.borderColor}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-semibold ${integration.textColor}`}>
                  {integration.name}
                </h3>
                <p className={`mt-2 text-sm ${integration.textColor} opacity-90`}>
                  {integration.description}
                </p>
              </div>
              <ArrowTopRightOnSquareIcon 
                className={`w-5 h-5 ${integration.textColor} opacity-0 group-hover:opacity-100 transition-opacity`} 
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 