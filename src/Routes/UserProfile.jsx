import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  // Link2,
  Trophy,
  CheckCircle2,
  // Code,
  LoaderCircle,
  ExternalLink,
  Github,
  Linkedin,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useParams, useStableCallback } from "@tanstack/react-router";
import { getUserProfile } from "@/api/services/authService";
import checkAuth from "@/utils/checkAuth";
import SubmissionDetails from "@/components/problempage/SubmissionDetails";
// import { setBrushSettings } from "recharts/types/state/brushSlice";

export default function UserProfile() {
  const { username } = useParams({ from: "/user/$username" });
  const [submissionId, setSubmissionId] = useState("");
  const [submissionPopup, setSubmissionPopup] = useState(false);
  const {
    data: userProfileData,
    isLoading: isProfileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["userprofile", username],
    queryFn: ({ queryKey }) => getUserProfile(queryKey[1]),
  });

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => checkAuth(),
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    // console.log("userprofile data ", userProfileData);
  }, [userProfileData]);

  const getDifficultyColor = (difficulty = "") => {
    const d = String(difficulty).trim().toLowerCase();
    if (d === "easy") {
      return "bg-green-500/20 text-green-400 border-green-500/30";
    }
    if (d === "medium") {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
    if (d === "hard") {
      return "bg-red-500/20 text-red-400 border-red-500/30";
    }
    return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  const loading = Boolean(isProfileLoading || isUserLoading);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-slate-950">
        <LoaderCircle className="animate-spin w-12 h-12 text-blue-400" />
      </div>
    );
  }

  if (!userProfileData || profileError) {
    return (
      <div className="relative z-10 w-full h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="text-slate-400 text-lg mb-2">User not found</p>
          <p className="text-slate-500 text-sm">
            The profile you're looking for doesn't exist or failed to load.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmissionDetail = (sid) => {
    setSubmissionId(sid);
    setSubmissionPopup(true);
  };

  const totalSolved =
    Number(userProfileData?.totalSolved) ||
    (userProfileData?.solvedByDifficulty || []).reduce(
      (s, it) => s + Number(it.value || 0),
      0
    );

  const validItems = (userProfileData?.solvedByDifficulty || []).filter(
    (it) => Number(it.value) > 0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none bg-slate-950">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>
      <div>
        <SubmissionDetails
          sid={submissionId}
          isOpen={submissionPopup}
          onClose={() => setSubmissionPopup(false)}
        />
      </div>
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
              <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold overflow-hidden">
                  <img src={userProfileData?.avatarUrl} alt="avatar" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-blue-400">
                    {userProfileData?.fullName}
                  </h2>
                  <p className="text-slate-400">@{userProfileData?.username}</p>
                </div>
                <span className="px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-400 flex items-center space-x-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span className="font-medium">Novice</span>
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {userProfileData?.joinedDate}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>--</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <Github className="w-4 h-4" />
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    --
                  </a>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <Linkedin className="w-4 h-4" />
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    --
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Ranking</span>
                  <span className="text-blue-400 font-medium">
                    Comming Soon
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Reputation</span>
                  <span className="text-blue-400 font-medium">
                    Comming Soon
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Streak</span>
                  <span className="text-blue-400 font-medium">
                    Comming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
                <p className="text-slate-400 text-sm mb-2">Total Solved</p>
                <h3 className="text-3xl font-bold text-blue-400 mb-1">
                  {userProfileData?.totalSolved}
                </h3>
                <p className="text-slate-500 text-sm">
                  out of {userProfileData?.totalQuestions}
                </p>
              </div>
              <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
                <p className="text-slate-400 text-sm mb-2">Acceptance Rate</p>
                <h3 className="text-3xl font-bold text-blue-400 mb-2">
                  {userProfileData?.acceptanceRate}%
                </h3>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full"
                    style={{
                      width: `${userProfileData?.acceptanceRate ?? 0}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
                <p className="text-slate-400 text-sm mb-2">Contest Rating</p>
                <h3 className="text-3xl font-bold text-blue-400 mb-1">
                  Comming Soon
                </h3>
              </div>
            </div>

            <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
                <h3 className="mb-4 text-blue-400">Submission Timeline</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={userProfileData?.monthlySolved || []}
                    margin={{ top: 10, right: 12, left: 8, bottom: 48 }}
                    barCategoryGap="18%"
                    maxBarSize={48}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      interval={0}
                      padding={{ left: 10, right: 10 }}
                      tick={{ angle: -30, textAnchor: "end", fontSize: 12 }}
                    />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        color: "#cbd5e1",
                      }}
                    />
                    <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
                <h3 className="text-lg font-bold text-blue-400 mb-6">
                  Problems by Difficulty
                </h3>
                <div className="flex items-center justify-between">
                  <div className="relative w-55 h-55">
                    <svg
                      viewBox="0 0 100 100"
                      className="transform -rotate-90"
                      style={{ transformOrigin: "50% 50%" }}
                    >
                      {totalSolved === 0 || validItems.length === 0 ? (
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          fill="#1e293b"
                          stroke="#334155"
                          strokeWidth="2"
                        />
                      ) : (
                        (() => {
                          let currentAngle = 0;
                          return validItems.map((item, index) => {
                            const percentage =
                              (Number(item.value) / totalSolved) * 100;
                            const angle = (percentage / 100) * 360;

                            // full circle
                            if (validItems.length === 1 || angle >= 359.99) {
                              return (
                                <circle
                                  key={index}
                                  cx="50"
                                  cy="50"
                                  r="35"
                                  fill={item.color}
                                  stroke="#1e293b"
                                  strokeWidth="2"
                                />
                              );
                            }

                            const startAngle = currentAngle;
                            currentAngle += angle;

                            const startX =
                              50 + 35 * Math.cos((startAngle * Math.PI) / 180);
                            const startY =
                              50 + 35 * Math.sin((startAngle * Math.PI) / 180);
                            const endX =
                              50 +
                              35 *
                                Math.cos(
                                  ((startAngle + angle) * Math.PI) / 180
                                );
                            const endY =
                              50 +
                              35 *
                                Math.sin(
                                  ((startAngle + angle) * Math.PI) / 180
                                );
                            const largeArc = angle > 180 ? 1 : 0;

                            return (
                              <path
                                key={index}
                                d={`M 50 50 L ${startX} ${startY} A 35 35 0 ${largeArc} 1 ${endX} ${endY} Z`}
                                fill={item.color}
                                stroke="#1e293b"
                                strokeWidth="2"
                              />
                            );
                          });
                        })()
                      )}
                      <circle cx="50" cy="50" r="22" fill="#0f172a" />
                    </svg>
                  </div>

                  <div className="space-y-3 flex-1 pl-6">
                    {(userProfileData?.solvedByDifficulty || []).map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm text-slate-300">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-sm text-blue-400 font-medium">
                            {item.value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold text-blue-400 mb-6">
                Recent Submissions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400"></th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                        Title
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                        Difficulty
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                        Date
                      </th>
                      {userData?.username === userProfileData?.username && (
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                          Details
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(userProfileData?.solvedHistory || []).map((question) => (
                      <tr
                        key={question.uid}
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href="#"
                            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                          >
                            {question.title}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(
                              question.difficulty
                            )}`}
                          >
                            {question.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-sm">
                          {question.topic}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-sm">
                          {question.date?.slice(0, 10)}
                        </td>
                        {userData?.username === userProfileData?.username && (
                          <td className="py-3 px-4 text-slate-400 text-sm cursor-pointer">
                            <ExternalLink
                              onClick={() =>
                                handleSubmissionDetail(question.sid)
                              }
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
