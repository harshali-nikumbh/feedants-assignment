import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ImportantDates from "../components/ImportantDates";
import CompetitionStats from "../components/CompetitionStats";
import JudgeCard from "../components/JudgeCard";


const API_URL =
  "http://localhost:5000/api/competitions/6ab8ba2223fd1246b38468ab";

type Competition = {
  title: string;
  category: string;
  type: string;
  prizePool: number;
  entryFee: number;
  maxParticipants: number;
  registeredParticipants: number;
  registrationStart: string;
  registrationEnd: string;
  submissionStart: string;
  submissionEnd: string;
  resultDate: string;
  status: string;
  certificateAvailable: boolean;
  judge: {
    name: string;
    profession: string;
    experience: string;
  };
  about: string;
  judgingParameters: string[];
  rules: string[];
  rewards: {
    position: string;
    amount: number;
  }[];
  previousWinners: {
    name: string;
    position: string;
  }[];
};

export default function HomeScreen() {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [submission, setSubmission] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);


    const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

 useEffect(() => {
  fetchCompetition();
  loadSubmission();
  loadRegistration();
}, []);


  

    useEffect(() => {
    if (!competition) return;

    const updateCountdown = () => {
      const endTime = new Date(competition.registrationEnd).getTime();
      const now = Date.now();

      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);

      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor(
        (totalSeconds % (24 * 60 * 60)) / (60 * 60)
      );
      const minutes = Math.floor(
        (totalSeconds % (60 * 60)) / 60
      );
      const seconds = totalSeconds % 60;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [competition]);

  const fetchCompetition = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (result.success) {
        setCompetition(result.data);
      }
    } catch (error) {
      console.log("Failed to load competition:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmission = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/submissions?competitionId=6ab8ba2223fd1246b38468ab&participantName=Harshali`
    );

    const result = await response.json();

    if (result.success) {
      setSubmission(result.data);
    }
  } catch (error) {
    console.log("Failed to load submission:", error);
  }
};


const loadRegistration = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/registrations?competitionId=6ab8ba2223fd1246b38468ab&participantName=Harshali`
    );

    const result = await response.json();

    if (result.success) {
      setRegistration(result.data);
    }
  } catch (error) {
    console.log("Failed to load registration:", error);
  }
};


const handleRegistration = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/registrations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          competitionId: "6ab8ba2223fd1246b38468ab",
          participantName: "Harshali",
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Registration successful!");
      await loadRegistration();
      await fetchCompetition();
    } else {
      alert(result.message || "Registration failed");
    }
  } catch (error) {
    console.log("Registration error:", error);
    alert("Something went wrong while registering.");
  }
};


  const handleUploadSubmission = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    const file = result.assets[0];

    const formData = new FormData();

    formData.append("competitionId", "6ab8ba2223fd1246b38468ab");
    formData.append("participantName", "Harshali");

    if (Platform.OS === "web" && file.file) {
  formData.append("submission", file.file);
} else {
  formData.append("submission", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || "video/mp4",
  } as any);
}

    const response = await fetch(
      "http://localhost:5000/api/submissions",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

  if (data.success) {
  alert("Submission uploaded successfully!");
  await loadSubmission();
} else {
  alert(data.message || "Upload failed");
}
  } catch (error) {
    console.log("Upload error:", error);
    alert("Something went wrong while uploading.");
  }
};

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#087f8c" />
        <Text style={styles.loadingText}>Loading competition...</Text>
      </View>
    );
  }

  if (!competition) {
    return (
      <View style={styles.loader}>
        <Text>Unable to load competition.</Text>
      </View>
    );
  }

  const spotsLeft =
    competition.maxParticipants - competition.registeredParticipants;

    const now = new Date();

const registrationOpen =
  now >= new Date(competition.registrationStart) &&
  now <= new Date(competition.registrationEnd) &&
  competition.registeredParticipants < competition.maxParticipants;


const submissionOpen =
  now >= new Date(competition.submissionStart) &&
  now <= new Date(competition.submissionEnd);

const submissionClosed =
  now > new Date(competition.submissionEnd);

const resultsAvailable =
  now >= new Date(competition.resultDate);


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={23} color="#183153" />
          </TouchableOpacity>

          <View style={styles.languageSwitch}>
            <Text style={styles.activeLanguage}>ENG</Text>
            <Text style={styles.hindiLanguage}>हिंदी</Text>
          </View>
        </View>

        {/* Competition Card */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={styles.titleArea}>
              <Text style={styles.title}>{competition.title}</Text>

              <View style={styles.badges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {competition.category}
                  </Text>
                </View>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{competition.type}</Text>
                </View>

                {competition.certificateAvailable && (
                  <View style={styles.certificate}>
                    <Ionicons
                      name="trophy-outline"
                      size={20}
                      color="#087f8c"
                    />
                    <Text style={styles.certificateText}>
                      Winners get certificate
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {registration ? (
  <View style={styles.registeredBadge}>
    <Ionicons
      name="checkmark-circle"
      size={20}
      color="#087f8c"
    />
    <Text style={styles.registeredText}>Registered</Text>
  </View>
) : registrationOpen ? (
  <TouchableOpacity
    style={styles.registerButton}
    onPress={handleRegistration}
  >
    <Text style={styles.registerButtonText}>Register Now</Text>
  </TouchableOpacity>
) : (
  <View style={styles.closedBadge}>
    <Text style={styles.closedBadgeText}>
      {spotsLeft <= 0 ? "Competition Full" : "Registration Closed"}
    </Text>
  </View>
)}
          </View>

<CompetitionStats
  prizePool={competition.prizePool}
  entryFee={competition.entryFee}
  registeredParticipants={competition.registeredParticipants}
  maxParticipants={competition.maxParticipants}
/>
        </View>

        {/* Judge */}
        <JudgeCard
  name={competition.judge.name}
  profession={competition.judge.profession}
  experience={competition.judge.experience}
/>


        {/* Registration Status */}
        <View style={styles.deadlineCard}>
          <Ionicons name="hourglass-outline" size={23} color="#087f8c" />

          <Text style={styles.deadlineLabel}>
  Registration closes in
</Text>

<View style={styles.countdown}>
  <Text style={styles.countdownValue}>
    {String(timeLeft.days).padStart(2, "0")}d
  </Text>

  <Text style={styles.countdownSeparator}>:</Text>

  <Text style={styles.countdownValue}>
    {String(timeLeft.hours).padStart(2, "0")}h
  </Text>

  <Text style={styles.countdownSeparator}>:</Text>

  <Text style={styles.countdownValue}>
    {String(timeLeft.minutes).padStart(2, "0")}m
  </Text>

  <Text style={styles.countdownSeparator}>:</Text>

  <Text style={styles.countdownValue}>
    {String(timeLeft.seconds).padStart(2, "0")}s
  </Text>
</View>

          <Ionicons name="timer-outline" size={23} color="#087f8c" />

          <Text style={styles.hurryText}>Hurry up!</Text>
        </View>

<ImportantDates
  registrationEnd={competition.registrationEnd}
  submissionStart={competition.submissionStart}
  submissionEnd={competition.submissionEnd}
  resultDate={competition.resultDate}
/>

        {/* Previous Winners */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Previous Winners</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {competition.previousWinners.map((winner, index) => (
              <View style={styles.winnerCard} key={index}>
                <View style={styles.winnerImage}>
                  <Ionicons
                    name="person"
                    size={30}
                    color="#087f8c"
                  />
                </View>

                <View>
                  <Text style={styles.winnerName}>
                    {winner.name}
                  </Text>
                  <Text style={styles.winnerPosition}>
                    {winner.position}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Tabs */}
        <View style={styles.card}>
          <View style={styles.tabs}>
            <TouchableOpacity
              onPress={() => setActiveTab("about")}
              style={[
                styles.tab,
                activeTab === "about" && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "about" && styles.activeTabText,
                ]}
              >
                About Competition
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("judging")}
              style={[
                styles.tab,
                activeTab === "judging" && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "judging" && styles.activeTabText,
                ]}
              >
                Judging Parameters
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("rules")}
              style={[
                styles.tab,
                activeTab === "rules" && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "rules" && styles.activeTabText,
                ]}
              >
                Rules & Eligibility
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "about" && (
            <Text style={styles.description}>{competition.about}</Text>
          )}

          {activeTab === "judging" && (
            <View>
              {competition.judgingParameters.map((item, index) => (
                <Text style={styles.listItem} key={index}>
                  • {item}
                </Text>
              ))}
            </View>
          )}

          {activeTab === "rules" && (
            <View>
              {competition.rules.map((item, index) => (
                <Text style={styles.listItem} key={index}>
                  • {item}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Rewards */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Rewards{" "}
            <Text style={styles.normalText}>(All Positions)</Text>
          </Text>

          {competition.rewards.map((reward, index) => (
            <View style={styles.rewardRow} key={index}>
              <View style={styles.rewardLeft}>
                <Ionicons
                  name={
                    index < 3
                      ? "medal-outline"
                      : "star-outline"
                  }
                  size={23}
                  color="#087f8c"
                />

                <Text style={styles.rewardPosition}>
                  {reward.position}
                </Text>
              </View>

              <Text style={styles.rewardAmount}>
                ₹ {reward.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color="#087f8c"
          />

          <Text style={styles.disclaimerText}>
            Only contributions from paid participants will be
            considered for judging.
          </Text>
        </View>




{/* Submission Action */}
{submissionClosed ? (
  <View style={styles.closedSubmissionButton}>
    <Ionicons
      name="lock-closed-outline"
      size={23}
      color="#6b7280"
    />

    <View>
      <Text style={styles.closedSubmissionText}>
        Submission Closed
      </Text>

      <Text style={styles.closedSubmissionSubtext}>
        The submission deadline has passed
      </Text>
    </View>
  </View>
) : submission ? (
  <>
    <TouchableOpacity
      style={styles.uploadedButton}
      disabled
    >
      <Ionicons
        name="checkmark-circle"
        size={23}
        color="white"
      />

      <View>
        <Text style={styles.uploadText}>
          Submission Uploaded
        </Text>

        <Text style={styles.uploadSubtext}>
          {submission.fileName || "Submitted successfully"}
        </Text>
      </View>
    </TouchableOpacity>

    {submission.fileUrl && (
      <TouchableOpacity
        style={styles.viewSubmissionButton}
        onPress={() => {
          if (Platform.OS === "web") {
            window.open(submission.fileUrl, "_blank");
          }
        }}
      >
        <Ionicons
          name="play-circle-outline"
          size={23}
          color="#087f8c"
        />

        <Text style={styles.viewSubmissionText}>
          View Uploaded Video
        </Text>
      </TouchableOpacity>
    )}
  </>
) : submissionOpen ? (
  <TouchableOpacity
    style={styles.uploadButton}
    onPress={handleUploadSubmission}
  >
    <Ionicons
      name="cloud-upload-outline"
      size={23}
      color="white"
    />

    <View>
      <Text style={styles.uploadText}>
        Upload Submission
      </Text>

      <Text style={styles.uploadSubtext}>
        Registered
      </Text>
    </View>
  </TouchableOpacity>
) : (
  <View style={styles.closedSubmissionButton}>
    <Ionicons
      name="time-outline"
      size={23}
      color="#087f8c"
    />

    <View>
      <Text style={styles.closedSubmissionText}>
        Submission Not Started
      </Text>

      <Text style={styles.closedSubmissionSubtext}>
        Submissions will open soon
      </Text>
    </View>
  </View>
)}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );


  
}



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7fbfc",
  },

  container: {
    flex: 1,
  },

registerButton: {
  backgroundColor: "#087f8c",
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 10,
},

registerButtonText: {
  color: "white",
  fontSize: 14,
  fontWeight: "700",
},

closedBadge: {
  backgroundColor: "#f1f3f5",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 10,
},

closedBadgeText: {
  color: "#6b7280",
  fontSize: 14,
  fontWeight: "700",
},

    countdown: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },

  countdownValue: {
    color: "#087f8c",
    fontSize: 18,
    fontWeight: "800",
  },

  countdownSeparator: {
    color: "#087f8c",
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 3,
  },

  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    padding: 18,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fbfc",
  },

  loadingText: {
    marginTop: 12,
    color: "#53677d",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  backButton: {
    padding: 8,
  },

  languageSwitch: {
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: "#edf3f5",
    overflow: "hidden",
  },

  activeLanguage: {
    backgroundColor: "#087f8c",
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontWeight: "700",
  },

  hindiLanguage: {
    color: "#53677d",
    paddingVertical: 8,
    paddingHorizontal: 15,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#edf1f3",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },

  titleArea: {
    flex: 1,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#183153",
    marginBottom: 12,
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 7,
  },

  badge: {
    backgroundColor: "#f1f4f7",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },

  badgeText: {
    color: "#53677d",
    fontWeight: "600",
    fontSize: 13,
  },

  certificate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  certificateText: {
    color: "#087f8c",
    fontWeight: "600",
    fontSize: 13,
  },

  registeredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#edf8f8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  registeredText: {
    color: "#087f8c",
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 25,
    gap: 25,
  },

  stat: {
    flex: 1,
  },

  statLabel: {
    color: "#718198",
    fontSize: 14,
    marginBottom: 5,
  },

  prize: {
    color: "#087f8c",
    fontSize: 28,
    fontWeight: "800",
  },

  statValue: {
    color: "#183153",
    fontSize: 23,
    fontWeight: "700",
  },

  spotsTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  spotsText: {
    color: "#087f8c",
    fontWeight: "700",
  },

  progressBackground: {
    height: 7,
    backgroundColor: "#dcebed",
    borderRadius: 5,
    marginTop: 10,
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    backgroundColor: "#087f8c",
    borderRadius: 5,
  },

  bookingText: {
    color: "#718198",
    fontSize: 12,
    marginTop: 5,
  },

  judgeSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  judgeAvatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#e4f4f4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  judgeInfo: {
    flex: 1,
  },

  judgeLabel: {
    color: "#718198",
    fontSize: 13,
  },

  judgeName: {
    fontSize: 19,
    fontWeight: "800",
    color: "#183153",
    marginVertical: 3,
  },

  judgeProfession: {
    color: "#53677d",
  },

  judgeExperience: {
    color: "#53677d",
    marginTop: 3,
  },

  videoButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#087f8c",
    justifyContent: "center",
    alignItems: "center",
  },

  videoText: {
    position: "absolute",
    top: 67,
    width: 80,
    textAlign: "center",
    color: "#53677d",
    fontSize: 12,
  },

  deadlineCard: {
    backgroundColor: "#eaf7f8",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },

  deadlineLabel: {
    color: "#183153",
    fontWeight: "700",
  },

  deadlineDate: {
    color: "#087f8c",
    fontWeight: "800",
  },

  hurryText: {
    color: "#087f8c",
    fontWeight: "800",
  },

  sectionTitle: {
    color: "#183153",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 15,
  },

  normalText: {
    fontWeight: "400",
    color: "#718198",
    fontSize: 13,
  },



  winnerCard: {
    width: 190,
    backgroundColor: "#f7fafb",
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  winnerImage: {
    width: 55,
    height: 55,
    borderRadius: 10,
    backgroundColor: "#dff1f2",
    justifyContent: "center",
    alignItems: "center",
  },

  winnerName: {
    color: "#183153",
    fontWeight: "700",
  },

  winnerPosition: {
    color: "#087f8c",
    fontSize: 12,
    marginTop: 3,
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e9ec",
    marginBottom: 15,
  },

  tab: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginRight: 12,
  },

  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#087f8c",
  },

  tabText: {
    color: "#718198",
    fontWeight: "600",
    fontSize: 13,
  },

  activeTabText: {
    color: "#087f8c",
  },

  description: {
    color: "#53677d",
    fontSize: 15,
    lineHeight: 23,
  },

  listItem: {
    color: "#53677d",
    marginBottom: 10,
    lineHeight: 21,
  },

  rewardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#edf1f3",
  },

  rewardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rewardPosition: {
    color: "#183153",
    fontWeight: "700",
  },

  rewardAmount: {
    color: "#087f8c",
    fontSize: 16,
    fontWeight: "800",
  },

  disclaimer: {
    backgroundColor: "#eaf7f8",
    borderRadius: 12,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },

  disclaimerText: {
    flex: 1,
    color: "#53677d",
    fontSize: 12,
  },

  uploadButton: {
    backgroundColor: "#087f8c",
    borderRadius: 13,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

uploadedButton: {
  backgroundColor: "#0b8f9c",
  borderRadius: 13,
  paddingVertical: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  opacity: 0.9,
},


closedSubmissionButton: {
  marginTop: 10,
  borderWidth: 1.5,
  borderColor: "#d6dce1",
  borderRadius: 13,
  paddingVertical: 14,
  paddingHorizontal: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  backgroundColor: "#f6f7f8",
},

closedSubmissionText: {
  color: "#374151",
  fontSize: 15,
  fontWeight: "700",
},

closedSubmissionSubtext: {
  color: "#6b7280",
  fontSize: 12,
  marginTop: 2,
},


viewSubmissionButton: {
  marginTop: 10,
  borderWidth: 1.5,
  borderColor: "#087f8c",
  borderRadius: 13,
  paddingVertical: 14,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
},

viewSubmissionText: {
  color: "#087f8c",
  fontSize: 15,
  fontWeight: "700",
}, 

  uploadText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },

  uploadSubtext: {
    color: "#d7f3f4",
    fontSize: 12,
    textAlign: "center",
  },
});