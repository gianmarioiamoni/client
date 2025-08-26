'use client';

import { useHomepage } from '@/hooks/useHomepage';
import { getFeatures } from '@/lib/homepage-utils';
import {
  Header,
  HeroSection,
  FeatureGrid,
  DemoSection,
  CTASection,
  Footer
} from '@/components/homepage';

/**
 * HomePage - Orchestrates homepage sections following SRP
 * Responsibility: Layout and coordination of homepage components
 */
export default function HomePage() {
  const { navigation, appInfo } = useHomepage();
  const features = getFeatures();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        appName={appInfo.name}
        onLogin={navigation.toLogin}
        onRegister={navigation.toRegister}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroSection
          onGetStarted={navigation.toRegister}
          onViewDemo={navigation.toDemo}
        />

        <FeatureGrid features={features} />

        <DemoSection onTryDemo={navigation.toDemo} />

        <CTASection onGetStarted={navigation.toRegister} />
      </main>

      <Footer />
    </div>
  );
}