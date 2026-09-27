import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type JudgeCardProps = {
  name: string;
  profession: string;
  experience: string;
};

export default function JudgeCard({
  name,
  profession,
  experience,
}: JudgeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.judgeSection}>
        <View style={styles.judgeAvatar}>
          <Ionicons name="person" size={38} color="#087f8c" />
        </View>

        <View style={styles.judgeInfo}>
          <Text style={styles.judgeLabel}>Judge</Text>

          <Text style={styles.judgeName}>
            {name}
          </Text>

          <Text style={styles.judgeProfession}>
            {profession}
          </Text>

          <Text style={styles.judgeExperience}>
            {experience}
          </Text>
        </View>

        <View style={styles.videoButton}>
          <Ionicons name="play" size={22} color="white" />
          <Text style={styles.videoText}>Intro Video</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#edf1f3",
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
});