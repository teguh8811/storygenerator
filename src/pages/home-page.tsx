import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Wand2, Film, FileText, Upload, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Create Amazing Video Scripts & Stories with AI
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-8">
            From idea to complete production package - generate scripts, visual prompts, and voice-over in minutes
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started for Free
              </Button>
            </Link>
            <Link to="/library">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">All-in-One Content Creation Platform</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to go from idea to complete production package
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-blue-50 border-0">
              <CardContent className="pt-8 px-6 pb-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Wand2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Story Generator</h3>
                <p className="text-gray-600">
                  Turn your ideas into fully-fleshed stories and scripts with our powerful AI engine
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-0">
              <CardContent className="pt-8 px-6 pb-6">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Film className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visual Prompt Generator</h3>
                <p className="text-gray-600">
                  Create detailed prompts for AI image and video generators for each scene
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-0">
              <CardContent className="pt-8 px-6 pb-6">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scene-by-Scene Editor</h3>
                <p className="text-gray-600">
                  Refine your content with our intuitive editor, customizing each scene to perfection
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-0">
              <CardContent className="pt-8 px-6 pb-6">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Voice Over Assistant</h3>
                <p className="text-gray-600">
                  Get AI recommendations for the perfect voice style and tone for your content
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-0">
              <CardContent className="pt-8 px-6 pb-6">
                <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Template Library</h3>
                <p className="text-gray-600">
                  Jump-start your creation with our library of professional templates
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-cyan-50 border-0">
              <CardContent className="pt-8 px-6 pb-6">
                <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Export</h3>
                <p className="text-gray-600">
                  Export your work as PDF, DOCX, or JSON for easy integration with other tools
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Create production-ready content in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Input Your Idea</h3>
              <p className="text-gray-600">
                Enter your content idea, target audience, and preferred style
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Content</h3>
              <p className="text-gray-600">
                Our AI creates a complete script with visual prompts and voice-over recommendations
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Edit & Export</h3>
              <p className="text-gray-600">
                Refine your content scene by scene and export in your preferred format
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing Content?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join thousands of creators who are using our platform to produce professional-quality content
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};