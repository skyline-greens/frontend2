"use client"

import {
  ArrowRight,
  BarChart3,
  Cloud,
  Cpu,
  Leaf,
  Monitor,
  Shield,
  Smartphone,
  Thermometer,
  Zap,
  Droplets,
  ChevronDown,
  Settings,
  DollarSign,
  HelpCircle,
  Wifi,
  Star,
  Quote,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "motion/react"
import { useRef, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Testimonials Data
const testimonials = [
  {
    id: 1,
    rating: 5,
    text: "Verdant has completely transformed our vertical farming operation. The IoT sensors and automated controls have increased our crop yield by 40% while reducing water usage by 30%. The real-time monitoring gives us peace of mind.",
    name: "Sarah Chen",
    title: "Farm Operations Manager",
    company: "GreenTech Farms",
    avatar: "SC",
    color: "bg-green-500",
  },
  {
    id: 2,
    rating: 5,
    text: "As a startup founder in agtech, I needed a solution that could scale with our growth. Verdant's cloud-based platform and Azure integration have been game-changers. The dashboard insights help us make data-driven decisions daily.",
    name: "Marcus Rodriguez",
    title: "CEO & Founder",
    company: "Urban Harvest Co",
    avatar: "MR",
    color: "bg-blue-500",
  },
  {
    id: 3,
    rating: 4,
    text: "The automated irrigation and climate control features have saved us countless hours of manual work. Our team can now focus on crop optimization rather than routine monitoring. Highly recommend for any serious farming operation.",
    name: "Emily Watson",
    title: "Agricultural Engineer",
    company: "Precision Grow Systems",
    avatar: "EW",
    color: "bg-purple-500",
  },
  {
    id: 4,
    rating: 5,
    text: "Implementing Verdant was seamless. The technical support team guided us through every step, and the ROI was evident within the first quarter. Our energy efficiency improved by 25% thanks to the smart LED controls.",
    name: "David Kim",
    title: "Facility Manager",
    company: "NextGen Agriculture",
    avatar: "DK",
    color: "bg-orange-500",
  },
  {
    id: 5,
    rating: 4,
    text: "The multi-warehouse management feature is incredible. We can monitor all our facilities from a single dashboard. The predictive analytics help us prevent issues before they impact our crops.",
    name: "Lisa Thompson",
    title: "Operations Director",
    company: "Vertical Farms Inc",
    avatar: "LT",
    color: "bg-pink-500",
  },
  {
    id: 6,
    rating: 5,
    text: "Verdant's MQTT protocol integration worked perfectly with our existing sensors. The real-time data visualization and automated alerts have revolutionized how we manage our greenhouse environments.",
    name: "James Park",
    title: "IoT Systems Engineer",
    company: "Smart Agriculture Solutions",
    avatar: "JP",
    color: "bg-cyan-500",
  },
]

// FAQ Data
const frequentlyAskedQuestions = [
  {
    category: "General",
    id: 1,
    questions: [
      {
        id: 1,
        icon: Leaf,
        question: "What is Verdant Smart Agriculture?",
        answer:
          "Verdant is an intelligent vertical indoor farming system that leverages IoT devices, cloud computing, and web-based monitoring to automate agricultural processes. Our platform integrates ESP8266 microcontrollers, Arduino sensors, and Raspberry Pi gateway devices with Azure cloud services for real-time data processing and device management.",
      },
      {
        id: 2,
        icon: Monitor,
        question: "How does Verdant improve traditional farming methods?",
        answer:
          "Verdant addresses traditional challenges in vertical indoor farming by implementing automated environmental monitoring, precise resource management, reduced manual labor, enhanced space utilization, and intelligent crop management across multiple greenhouse environments. Our system provides 24/7 monitoring and automated responses to environmental changes.",
      },
      {
        id: 3,
        icon: BarChart3,
        question: "What kind of data and analytics does Verdant provide?",
        answer:
          "Our platform provides comprehensive dashboards with real-time charts showing temperature, humidity, CO₂ levels, soil moisture, water consumption, fertilizer usage, and energy efficiency. You can track performance across multiple warehouses, monitor individual cell conditions, and analyze historical trends to optimize your farming operations.",
      },
      {
        id: 4,
        icon: Smartphone,
        question: "Can I access Verdant from multiple devices?",
        answer:
          "Yes! Verdant features a modern Next.js web interface that works seamlessly across desktop computers, tablets, and smartphones. Your farm data syncs in real-time across all devices, so you can monitor and control your operations from anywhere.",
      },
    ],
  },
  {
    id: 2,
    category: "Technology",
    questions: [
      {
        id: 5,
        icon: Cpu,
        question: "What IoT devices and sensors does Verdant support?",
        answer:
          "Verdant integrates with ESP8266 microcontrollers, Arduino sensors, and Raspberry Pi gateway devices. Our sensor network includes DHT sensors for environmental monitoring, LDR for light detection, soil moisture sensors, and CO₂ sensors. We also support automated actuators including air pumps, water pumps, LED lights, and heaters.",
      },
      {
        id: 6,
        icon: Wifi,
        question: "How does the MQTT communication protocol work?",
        answer:
          "Verdant uses MQTT protocol for reliable, real-time communication between IoT devices and our cloud platform. This lightweight messaging protocol ensures efficient data transmission from your sensors to the dashboard, enabling instant monitoring and rapid response to environmental changes.",
      },
      {
        id: 7,
        icon: Cloud,
        question: "What cloud infrastructure does Verdant use?",
        answer:
          "Our platform is built on enterprise-grade Azure cloud services, including Azure Kubernetes Service (AKS) and Event Grid for scalable, reliable data processing. We use PostgreSQL for data storage and Nest.js for backend services, ensuring high availability and performance for your farming operations.",
      },
      {
        id: 8,
        icon: Settings,
        question: "How do I control actuators and hardware remotely?",
        answer:
          "Through our web dashboard, you can remotely control all connected hardware including water pumps, LED lighting systems, heaters, and ventilation fans. The interface provides real-time status updates and allows you to set automated schedules or manual overrides for any connected device.",
      },
    ],
  },
  {
    id: 3,
    category: "Setup",
    questions: [
      {
        id: 9,
        icon: Zap,
        question: "How long does it take to set up Verdant?",
        answer:
          "Initial setup typically takes 2-4 hours depending on the size of your operation. This includes installing sensors, connecting IoT devices, configuring your dashboard, and calibrating the system. Our technical team provides full setup support and training to ensure smooth deployment.",
      },
      {
        id: 10,
        icon: Shield,
        question: "What technical requirements do I need?",
        answer:
          "You'll need a stable internet connection, power supply for IoT devices, and basic infrastructure for mounting sensors. Our system works with standard greenhouse setups and can be retrofitted to existing facilities. We provide all necessary hardware and detailed installation guides.",
      },
      {
        id: 11,
        icon: Thermometer,
        question: "How do I calibrate sensors for optimal accuracy?",
        answer:
          "Sensor calibration is handled through our dashboard interface. We provide step-by-step calibration procedures for each sensor type, and our system includes automatic drift detection and correction. Regular calibration reminders ensure your data remains accurate over time.",
      },
      {
        id: 12,
        icon: Droplets,
        question: "Can Verdant integrate with existing irrigation systems?",
        answer:
          "Yes! Verdant can integrate with most existing irrigation and hydroponic systems. Our water pump controllers and flow sensors can be connected to your current setup, allowing you to maintain your existing infrastructure while adding intelligent automation and monitoring capabilities.",
      },
    ],
  },
  {
    id: 4,
    category: "Pricing",
    questions: [
      {
        id: 13,
        icon: DollarSign,
        question: "What pricing plans does Verdant offer?",
        answer:
          "We offer flexible pricing tiers based on the number of sensors, warehouses, and features you need. Our plans include a starter package for small operations, professional plans for medium-scale farms, and enterprise solutions for large commercial operations. Contact us for a customized quote based on your specific requirements.",
      },
      {
        id: 14,
        icon: HelpCircle,
        question: "Is there a free trial available?",
        answer:
          "Yes! We offer a 30-day free trial that includes full access to our platform with up to 10 sensors and 1 warehouse. This allows you to test all features and see the benefits of intelligent farming before committing to a paid plan.",
      },
      {
        id: 15,
        icon: Shield,
        question: "What support and maintenance is included?",
        answer:
          "All plans include 24/7 technical support, regular software updates, cloud hosting, and basic maintenance. Premium plans also include on-site support, hardware replacement warranties, and priority response times. We ensure your farming operations run smoothly year-round.",
      },
      {
        id: 16,
        icon: BarChart3,
        question: "Can I upgrade or downgrade my plan anytime?",
        answer:
          "You can upgrade or downgrade your plan at any time through your dashboard. Changes take effect immediately, and billing is prorated. As your farming operation grows, you can easily add more sensors, warehouses, or features to match your expanding needs.",
      },
    ],
  },
]

// Animated Counter Component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev < value) {
            return Math.min(prev + Math.ceil(value / 50), value)
          }
          return value
        })
      }, 30)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}`}
        />
      ))}
    </div>
  )
}

// Section Divider Component
function SectionDivider({
  fromColor = "from-white",
  toColor = "to-gray-50",
  reverse = false,
  height = "h-32",
}: {
  fromColor?: string
  toColor?: string
  reverse?: boolean
  height?: string
}) {
  return (
    <div className={`relative ${height} overflow-hidden`}>
      <div
        className={`absolute inset-0 bg-gradient-to-b ${reverse ? toColor : fromColor} ${reverse ? fromColor : toColor}`}
      ></div>
      <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          opacity="0.25"
          className={`fill-current ${reverse ? "text-gray-50" : "text-white"}`}
        ></path>
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          opacity="0.5"
          className={`fill-current ${reverse ? "text-gray-50" : "text-white"}`}
        ></path>
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          className={`fill-current ${reverse ? "text-gray-50" : "text-white"}`}
        ></path>
      </svg>
    </div>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const [showMore, setShowMore] = useState(false)
  const visibleTestimonials = showMore ? testimonials : testimonials.slice(0, 6)

  return (
    <section className="w-full relative">
      {/* Smooth transition from previous section */}
      <SectionDivider fromColor="from-gray-50" toColor="to-slate-900" height="h-40" />

      <div className="w-full py-16 md:py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900"></div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-green-600/20 text-green-400 border-green-600/30 mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              What our smart farmers
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                have to say
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Verdant has helped 1000+ farmers supercharge their productivity with cutting-edge IoT and smart
              agriculture tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-slate-800/50 border border-slate-700 hover:border-green-500/30 transition-all duration-300 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <StarRating rating={testimonial.rating} />
                      <Quote className="h-5 w-5 text-green-400" />
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm">{testimonial.text}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={`${testimonial.color} text-white font-semibold`}>
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                        <p className="text-gray-400 text-xs">{testimonial.title}</p>
                        <p className="text-green-400 text-xs">{testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {testimonials.length > 6 && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowMore(!showMore)}
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50"
                >
                  {showMore ? "Show less" : "Show more"}
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

// FAQ Components
function FAQ({ question, activeQuestion, handleQuestionClick }: any) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="shrink-0 grow-0"
    >
      <button
        className="flex w-full cursor-pointer items-center text-left"
        onClick={() => handleQuestionClick(question.id)}
      >
        <div className="mr-6 rounded-xl border-2 border-green-200 p-3.5 max-sm:mr-4 max-sm:p-3">
          <question.icon className="h-6 w-6 text-green-600" />
        </div>

        <p className="mr-auto pr-4 text-left text-xl font-medium tracking-tight text-gray-900 max-lg:text-lg max-sm:text-base">
          {question.question}
        </p>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center">
          <motion.div
            animate={{ rotate: activeQuestion === question.id ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6 text-gray-600" />
          </motion.div>
        </div>
      </button>
      <motion.div
        initial={{ opacity: 0, maxHeight: 0 }}
        animate={
          activeQuestion === question.id
            ? {
                opacity: 1,
                maxHeight: "300px",
                paddingTop: "1rem",
              }
            : {
                opacity: 0,
                maxHeight: 0,
                paddingTop: "0rem",
              }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pr-14 pl-20 text-lg font-light text-gray-600 max-lg:text-base max-sm:pr-0 max-sm:pl-0">
          {question.answer}
        </p>
      </motion.div>
    </motion.li>
  )
}

function FAQList({ category, questions, activeQuestion, handleQuestionClick }: any) {
  return (
    <motion.ul
      className="m-auto flex max-w-4xl flex-col gap-y-8"
      initial="hidden"
      animate="visible"
      key={category}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            ease: "easeIn",
          },
        },
      }}
    >
      {questions.map((question: any) => (
        <FAQ
          key={question.id}
          question={question}
          activeQuestion={activeQuestion}
          handleQuestionClick={handleQuestionClick}
        />
      ))}
    </motion.ul>
  )
}

function FAQSection() {
  const [category, setActiveCategory] = useState("General")
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)

  const categoryObj = frequentlyAskedQuestions.filter((obj) => obj.category === category).at(0)
  const questionsArr = categoryObj?.questions || []

  const handleQuestionClick = (id: number) => (id === activeQuestion ? setActiveQuestion(null) : setActiveQuestion(id))

  const handleCategoryClick = (category: string) => {
    setActiveQuestion(null)
    setActiveCategory(category)
  }

  return (
    <section className="w-full relative">
      {/* Smooth transition from testimonials */}
      <SectionDivider fromColor="from-slate-900" toColor="to-gray-50" height="h-40" />

      <div className="w-full py-16 md:py-24 bg-gray-50 relative">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="border-green-200 text-green-700 mb-4">
              Support
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              The most commonly asked questions about Verdant Smart Agriculture.
              <br />
              Have any other questions?{" "}
              <Link href="#" className="text-green-600 hover:text-green-700 underline underline-offset-2">
                Chat with our expert tech team
              </Link>
            </p>
          </motion.div>

          <motion.ul
            className="mb-16 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {frequentlyAskedQuestions.map((obj) => (
              <li key={obj.id}>
                <motion.button
                  className={`cursor-pointer rounded-full border-2 px-8 py-3.5 text-lg font-medium transition-all duration-200 ${
                    obj.category === category
                      ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/25"
                      : "border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                  }`}
                  onClick={() => handleCategoryClick(obj.category)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {obj.category}
                </motion.button>
              </li>
            ))}
          </motion.ul>

          <FAQList
            category={category}
            questions={questionsArr}
            activeQuestion={activeQuestion}
            handleQuestionClick={handleQuestionClick}
          />
        </div>
      </div>
    </section>
  )
}

// Subtle Green Light Effects
function GreenLightEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="green-lights">
        <div className="light-orb light-orb-1"></div>
        <div className="light-orb light-orb-2"></div>
        <div className="light-orb light-orb-3"></div>
        <div className="light-beam light-beam-1"></div>
        <div className="light-beam light-beam-2"></div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  const features = [
    {
      icon: Thermometer,
      title: "Environmental Monitoring",
      description:
        "Real-time DHT sensors, LDR light detection, soil moisture, and CO₂ monitoring for optimal growing conditions.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Automated Control",
      description: "Smart actuators including air pumps, water pumps, LED lights, and heaters for precise automation.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive dashboards with real-time charts and data visualization for informed decision making.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Cloud,
      title: "Cloud Integration",
      description: "Enterprise Azure cloud services with AKS and Event Grid for scalable, reliable data processing.",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: Cpu,
      title: "IoT Connectivity",
      description: "ESP8266 microcontrollers, Arduino sensors, and Raspberry Pi gateways with MQTT protocol.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Smartphone,
      title: "Modern Interface",
      description: "Intuitive Next.js dashboard with authentication, warehouse management, and session tracking.",
      gradient: "from-teal-500 to-green-500",
    },
  ]

  const stats = [
    { value: 99.9, suffix: "%", label: "Uptime" },
    { value: 50, suffix: "+", label: "Sensors" },
    { value: 24, suffix: "/7", label: "Monitoring" },
    { value: 95, suffix: "%", label: "Efficiency" },
  ]

  return (
    <>
      <style jsx global>{`
        @keyframes float-orb {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
          66% {
            transform: translateY(10px) translateX(-10px);
            opacity: 0.4;
          }
        }

        @keyframes beam-sweep {
          0% {
            transform: translateX(-100%) rotate(45deg);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(100vw) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes pulse-green {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
          }
        }

        .green-lights {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .light-orb {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%);
          animation: float-orb 8s ease-in-out infinite;
        }

        .light-orb-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .light-orb-2 {
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .light-orb-3 {
          bottom: 20%;
          left: 30%;
          animation-delay: 4s;
        }

        .light-beam {
          position: absolute;
          width: 2px;
          height: 100vh;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(34, 197, 94, 0.2),
            rgba(34, 197, 94, 0.1),
            transparent
          );
          animation: beam-sweep 15s linear infinite;
        }

        .light-beam-1 {
          left: 20%;
          animation-delay: 0s;
        }

        .light-beam-2 {
          left: 80%;
          animation-delay: 7s;
        }

        .gradient-border {
          position: relative;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(135deg, #22c55e, #10b981) border-box;
          border: 2px solid transparent;
        }

        .glow-green {
          animation: pulse-green 3s infinite;
        }

        .paper-overlay {
          position: relative;
          z-index: 10;
          margin-top: -4rem;
          border-radius: 2rem 2rem 0 0;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
        }

        .smooth-transition {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
        <GreenLightEffects />

        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50"
        >
          <Link className="flex items-center justify-center" href="#">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Image src="/images/logo.png" alt="Verdant Logo" width={40} height={40} className="mr-3" />
            </motion.div>
            <span className="font-bold text-xl text-gray-900">Verdant</span>
          </Link>
          <nav className="ml-auto flex gap-6 sm:gap-8">
            {["Features", "Technology", "Pricing", "Contact"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors duration-200"
                  href={`#${item.toLowerCase()}`}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="ml-8 flex gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href='/auth/sign-in'  className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25">
                Get Started
              </Link>
            </motion.div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 relative bg-gradient-to-br from-white via-green-50/30 to-white">
          <motion.div
            style={{ y: heroY }}
            className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"
          ></motion.div>
          <motion.div
            style={{ y: heroY }}
            className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-green-400/15 rounded-full blur-3xl"
          ></motion.div>

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-16 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Badge variant="outline" className="w-fit border-green-200 text-green-700 mb-4">
                    <Leaf className="w-3 h-3 mr-1" />
                    Smart Agriculture Platform
                  </Badge>
                </motion.div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl text-gray-900">
                    Intelligent
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                      Vertical Farming
                    </span>
                    <span className="block">Made Simple</span>
                  </h1>
                  <p className="max-w-[600px] text-xl text-gray-600 leading-relaxed">
                    Transform your agriculture with our IoT-powered vertical farming system. Monitor, automate, and
                    optimize your crops with real-time data and intelligent controls.
                  </p>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl shadow-green-600/25 px-8"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" size="lg" className="border-gray-300 px-8">
                      Watch Demo
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-8 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {[
                    { icon: Shield, text: "Enterprise Ready" },
                    { icon: Cloud, text: "Azure Powered" },
                    { icon: Monitor, text: "24/7 Monitoring" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.text}
                      className="flex items-center gap-2 text-sm text-gray-600"
                      whileHover={{ scale: 1.05, color: "#059669" }}
                    >
                      <item.icon className="h-4 w-4 text-green-600" />
                      {item.text}
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-2xl opacity-20"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  ></motion.div>

                  <motion.div whileHover={{ y: -5, rotateY: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="relative bg-white border border-gray-200 shadow-2xl shadow-green-600/10 glow-green">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center text-gray-900">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <Leaf className="h-5 w-5 mr-2 text-green-600" />
                          </motion.div>
                          Live Farm Dashboard
                        </CardTitle>
                        <CardDescription>Real-time monitoring across all systems</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: 25, suffix: "°C", label: "Temperature", color: "text-blue-600", bg: "bg-blue-50" },
                            { value: 68, suffix: "%", label: "Humidity", color: "text-cyan-600", bg: "bg-cyan-50" },
                            {
                              value: 400,
                              suffix: "ppm",
                              label: "CO₂ Level",
                              color: "text-purple-600",
                              bg: "bg-purple-50",
                            },
                            {
                              value: 85,
                              suffix: "%",
                              label: "Soil Moisture",
                              color: "text-green-600",
                              bg: "bg-green-50",
                            },
                          ].map((metric, index) => (
                            <motion.div
                              key={metric.label}
                              className={`p-3 rounded-lg ${metric.bg} text-center`}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className={`text-2xl font-bold ${metric.color}`}>
                                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                              </div>
                              <div className="text-xs text-gray-600 mt-1">{metric.label}</div>
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <motion.div
                              className="h-2 w-2 bg-green-500 rounded-full"
                              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            ></motion.div>
                            <span className="text-sm text-gray-600">
                              <AnimatedCounter value={5} /> Warehouses Active
                            </span>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            All Systems Optimal
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats Section */}
          <motion.div
            className="container px-4 md:px-6 mx-auto mt-16 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features Section with Paper Overlay Effect */}
        <section id="features" className="w-full relative">
          <SectionDivider fromColor="from-green-50/30" toColor="to-gray-50" height="h-32" />

          <div className="w-full py-16 md:py-24 bg-gray-50 relative paper-overlay">
            <div className="container px-4 md:px-6 mx-auto relative z-10">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="border-green-200 text-green-700 mb-4">
                  Platform Features
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  Everything you need for
                  <span className="block text-green-600">smart agriculture</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  From IoT sensors to cloud analytics, our comprehensive platform provides all the tools you need for
                  modern vertical farming.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full bg-white border border-gray-200 hover:border-green-200 hover:shadow-xl hover:shadow-green-600/10 transition-all duration-300 group">
                      <CardHeader>
                        <motion.div
                          className={`h-12 w-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}
                          whileHover={{ rotate: 5 }}
                        >
                          <feature.icon className="h-7 w-7 text-white" />
                        </motion.div>
                        <CardTitle className="text-gray-900 group-hover:text-green-600 transition-colors">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section id="technology" className="w-full relative">
          <SectionDivider fromColor="from-gray-50" toColor="to-white" height="h-32" />

          <div className="w-full py-16 md:py-24 bg-white relative paper-overlay">
            <div className="container px-4 md:px-6 mx-auto relative z-10">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="border-green-200 text-green-700 mb-4">
                  Technology Stack
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  Built with enterprise-grade technology
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our platform leverages cutting-edge hardware and software to deliver reliable, scalable solutions.
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-12">
                {[
                  {
                    title: "Hardware & IoT",
                    items: [
                      "ESP8266 Microcontrollers",
                      "Arduino Sensor Integration",
                      "Raspberry Pi Gateway Devices",
                      "MQTT Protocol Communication",
                    ],
                    icon: Cpu,
                    gradient: "from-green-500 to-emerald-500",
                  },
                  {
                    title: "Software & Cloud",
                    items: [
                      "Next.js Frontend Application",
                      "Nest.js Backend Services",
                      "PostgreSQL Database",
                      "Azure Kubernetes Service",
                    ],
                    icon: Cloud,
                    gradient: "from-blue-500 to-indigo-500",
                  },
                ].map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, x: sectionIndex === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                      <CardHeader>
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${section.gradient} p-2.5 mb-4`}>
                          <section.icon className="h-7 w-7 text-white" />
                        </div>
                        <CardTitle className="text-2xl text-gray-900">{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {section.items.map((item, index) => (
                            <motion.div
                              key={item}
                              className="flex items-center gap-3 group"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              viewport={{ once: true }}
                              whileHover={{ x: 5 }}
                            >
                              <div className="h-2 w-2 bg-green-500 rounded-full group-hover:scale-125 transition-transform"></div>
                              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Demonstrations */}
        <section className="w-full relative">
          <SectionDivider fromColor="from-white" toColor="to-slate-900" height="h-40" />

          <div className="w-full py-16 md:py-24 bg-slate-900 relative overflow-hidden paper-overlay">
            <GreenLightEffects />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
              {/* Farm Management Section */}
              <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                      All The Tools You Need to
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                        Supercharge Your Farming
                      </span>
                    </h2>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-2xl opacity-20"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                      <Image
                        src="/images/dashboard-unit.png"
                        alt="Farm Management Dashboard"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Smart Farm Analytics */}
              <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                <motion.div
                  className="order-2 lg:order-1"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-2xl opacity-20"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                      <Image
                        src="/images/dashboard-unit.png"
                        alt="Warehouse Management Dashboard"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="order-1 lg:order-2 space-y-6"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="space-y-4">
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Smart Farm Analytics</h3>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      Automatically monitor and analyze your farm data using
                      <span className="text-green-400"> AI-driven insights</span>. Verdant intelligently tracks key
                      metrics like water consumption, fertilizer usage, and energy efficiency, making it easy to
                      optimize your operations when you need them most.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-4">
                      <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Real-time Charts
                      </Badge>
                      <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                        <Monitor className="w-3 h-3 mr-1" />
                        Live Monitoring
                      </Badge>
                      <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30">
                        <Zap className="w-3 h-3 mr-1" />
                        Automated Alerts
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Real-time Control */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="space-y-4">
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Real-time Hardware Control</h3>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      Stay on top of important tasks with
                      <span className="text-green-400"> IoT-powered controls</span> that adapt to the conditions of your
                      crops. Verdant recognizes optimal growing conditions, environmental changes, and key actions from
                      your sensors and sends timely commands to ensure nothing slips through the cracks.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="flex items-center gap-3 p-3 bg-green-600/10 rounded-lg border border-green-600/20">
                        <Droplets className="h-5 w-5 text-green-400" />
                        <div>
                          <div className="text-sm font-medium text-white">Water Control</div>
                          <div className="text-xs text-gray-400">Automated irrigation</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-orange-600/10 rounded-lg border border-orange-600/20">
                        <Thermometer className="h-5 w-5 text-orange-400" />
                        <div>
                          <div className="text-sm font-medium text-white">Temperature</div>
                          <div className="text-xs text-gray-400">Climate control</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-yellow-600/10 rounded-lg border border-yellow-600/20">
                        <Zap className="h-5 w-5 text-yellow-400" />
                        <div>
                          <div className="text-sm font-medium text-white">LED Lighting</div>
                          <div className="text-xs text-gray-400">Growth optimization</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-600/10 rounded-lg border border-blue-600/20">
                        <Cloud className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="text-sm font-medium text-white">Air Quality</div>
                          <div className="text-xs text-gray-400">Ventilation control</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-20"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                      <Image
                        src="/images/dashboard-unit.png"
                        alt="Unit Control Dashboard"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Features Showcase */}
        <section className="w-full relative">
          <SectionDivider fromColor="from-slate-900" toColor="to-gray-50" height="h-40" />

          <div className="w-full py-16 md:py-24 bg-gray-50 relative paper-overlay">
            <div className="container px-4 md:px-6 mx-auto relative z-10">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="border-green-200 text-green-700 mb-4">
                  Platform Capabilities
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  Comprehensive Farm Management
                  <span className="block text-green-600">at Your Fingertips</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  From warehouse oversight to individual cell monitoring, control every aspect of your vertical farm
                  with precision.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Multi-Warehouse Management",
                    description:
                      "Monitor and manage multiple warehouses from a single dashboard with real-time capacity tracking and performance metrics.",
                    icon: Monitor,
                    features: [
                      "Capacity Monitoring",
                      "Performance Analytics",
                      "Resource Allocation",
                      "Status Tracking",
                    ],
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    title: "Individual Cell Control",
                    description:
                      "Granular control over each growing cell with environmental monitoring and automated adjustments.",
                    icon: Cpu,
                    features: ["Temperature Control", "Humidity Management", "Growth Tracking", "Harvest Scheduling"],
                    gradient: "from-green-500 to-emerald-500",
                  },
                  {
                    title: "Hardware Automation",
                    description:
                      "Direct control of IoT devices including pumps, lights, heaters, and sensors with real-time feedback.",
                    icon: Zap,
                    features: ["Water Pumps", "LED Systems", "Climate Control", "Sensor Networks"],
                    gradient: "from-purple-500 to-pink-500",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full bg-white border border-gray-200 hover:border-green-200 hover:shadow-xl hover:shadow-green-600/10 transition-all duration-300 group">
                      <CardHeader>
                        <motion.div
                          className={`h-12 w-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}
                          whileHover={{ rotate: 5 }}
                        >
                          <feature.icon className="h-7 w-7 text-white" />
                        </motion.div>
                        <CardTitle className="text-gray-900 group-hover:text-green-600 transition-colors">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 leading-relaxed mb-4">
                          {feature.description}
                        </CardDescription>
                        <div className="space-y-2">
                          {feature.features.map((item, itemIndex) => (
                            <motion.div
                              key={item}
                              className="flex items-center gap-2 text-sm text-gray-600"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * itemIndex }}
                              viewport={{ once: true }}
                            >
                              <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                              {item}
                            </motion.div>
                          ))}
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Enhanced CTA Section */}
        <section className="w-full relative">
          <SectionDivider fromColor="from-gray-50" toColor="to-green-600" height="h-40" />

          <div className="w-full py-20 md:py-32 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 relative overflow-hidden paper-overlay">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl"
                animate={{
                  y: [0, 20, 0],
                  x: [0, -10, 0],
                }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-10">
              <motion.div
                className="text-center max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2">
                    <Leaf className="w-4 h-4 mr-2" />
                    Transform Your Agriculture Today
                  </Badge>
                </motion.div>

                <motion.h2
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Ready to transform your
                  <span className="block text-white/90">agriculture?</span>
                </motion.h2>

                <motion.p
                  className="text-xl md:text-2xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Join thousands of farmers who are already using Verdant to optimize their crops, reduce costs, and
                  increase yields with intelligent IoT automation.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-white text-green-600 hover:bg-gray-50 shadow-2xl shadow-black/20 px-10 py-4 text-lg font-semibold"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-10 py-4 text-lg font-semibold backdrop-blur-sm"
                    >
                      Schedule Demo
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  className="flex flex-wrap justify-center items-center gap-8 text-green-100"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-medium">30-Day Free Trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    <span className="text-sm font-medium">Setup in 2 Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    <span className="text-sm font-medium">99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    <span className="text-sm font-medium">24/7 Support</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 bg-slate-900 border-t border-slate-800 relative">
          <SectionDivider fromColor="from-green-600" toColor="to-slate-900" height="h-32" reverse />

          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Brand Section */}
              <motion.div
                className="md:col-span-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <Image src="/images/logo.png" alt="Verdant Logo" width={32} height={32} className="mr-3" />
                  <span className="font-bold text-xl text-white">Verdant</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Intelligent vertical indoor farming system powered by IoT devices and cloud computing for modern
                  agriculture.
                </p>
                <div className="flex gap-4">
                  {["twitter", "linkedin", "github"].map((social) => (
                    <motion.a
                      key={social}
                      href="#"
                      className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-slate-700 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="sr-only">{social}</span>
                      <div className="w-4 h-4 bg-current rounded-full"></div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Navigation Columns */}
              {[
                {
                  title: "Platform",
                  links: ["Features", "Technology", "Integrations", "Security"],
                },
                {
                  title: "Resources",
                  links: ["Documentation", "API Reference", "Tutorials", "Blog"],
                },
                {
                  title: "Support",
                  links: ["Help Center", "Contact", "Community", "Status"],
                },
              ].map((column, index) => (
                <motion.div
                  key={column.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-semibold text-white mb-4">{column.title}</h3>
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link}>
                        <motion.a
                          href="#"
                          className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                          whileHover={{ x: 5 }}
                        >
                          {link}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
              <motion.p
                className="text-gray-400 text-sm mb-4 md:mb-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                © 2024 Verdant Smart Agriculture. All rights reserved.
              </motion.p>
              <div className="flex gap-6">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, index) => (
                  <motion.a
                    key={item}
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
