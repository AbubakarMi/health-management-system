"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  Building2,
  Shield,
  Users,
  Heart,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Clock,
  TrendingUp,
  Award,
  Star,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                CareFlux
              </span>
            </div>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
                Staff Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full text-teal-700 text-sm font-medium">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              Multi-Hospital Cloud Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              Healthcare Management
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Reimagined for Scale
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Empower multiple hospitals with a unified, AI-powered healthcare management system.
              Streamline operations, enhance patient care, and unlock insights across your entire network.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white h-14 px-8 text-lg">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-teal-600">500+</div>
                <div className="text-gray-600 mt-1">Hospitals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-600">1M+</div>
                <div className="text-gray-600 mt-1">Patients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600">99.9%</div>
                <div className="text-gray-600 mt-1">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-600 mt-1">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything Your Hospital Network Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive features designed to support multi-hospital operations at scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-teal-200 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Multi-Tenant Architecture</CardTitle>
                <CardDescription>
                  Manage multiple hospitals from a single platform with complete data isolation and customization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-cyan-200 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>
                  Complete patient records, medical history, admissions, and seamless data sharing across facilities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-emerald-200 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle>Real-Time Analytics</CardTitle>
                <CardDescription>
                  Monitor KPIs, track performance, and make data-driven decisions across your hospital network
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  HIPAA compliant, end-to-end encryption, and role-based access control for maximum security
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Leverage AI for diagnosis support, risk assessment, and predictive analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Cloud-Based Platform</CardTitle>
                <CardDescription>
                  Access from anywhere, automatic updates, and infinite scalability without infrastructure costs
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple Setup, Powerful Results
            </h2>
            <p className="text-xl text-gray-600">Get your hospital network up and running in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Register Your Hospitals</h3>
              <p className="text-gray-600">
                Add your hospitals to the platform with custom branding and configuration for each facility
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Staff Accounts</h3>
              <p className="text-gray-600">
                Administrators create user accounts for doctors, nurses, lab techs, and other staff members
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Managing Care</h3>
              <p className="text-gray-600">
                Staff members log in and immediately access all tools needed for patient care and operations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Healthcare Networks Choose CareFlux
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Centralized Control</h3>
                    <p className="text-gray-600">
                      Manage all hospitals from one dashboard while maintaining facility-level autonomy
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Reduced Costs</h3>
                    <p className="text-gray-600">
                      Eliminate duplicate systems and reduce IT overhead with a unified platform
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Better Patient Care</h3>
                    <p className="text-gray-600">
                      Share patient data seamlessly across facilities for coordinated, comprehensive care
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Scalable Growth</h3>
                    <p className="text-gray-600">
                      Easily add new hospitals, departments, and staff as your network expands
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-teal-600" />
                    <span className="font-semibold text-gray-900">Setup Time</span>
                  </div>
                  <span className="text-2xl font-bold text-teal-600">15 min</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-cyan-600" />
                    <span className="font-semibold text-gray-900">Efficiency Gain</span>
                  </div>
                  <span className="text-2xl font-bold text-cyan-600">40%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-emerald-600" />
                    <span className="font-semibold text-gray-900">User Satisfaction</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">98%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-purple-600" />
                    <span className="font-semibold text-gray-900">Compliance Rate</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Hospital Network?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join hundreds of hospitals already using CareFlux to deliver better healthcare
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/login">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 h-14 px-8 text-lg">
                  Access Your Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">CareFlux</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>SOC 2 Type II</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>© 2025 Nubenta Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
