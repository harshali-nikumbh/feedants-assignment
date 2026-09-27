import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type CompetitionStatsProps = {
  prizePool: number;
  entryFee: number;
  registeredParticipants: number;
  maxParticipants: number;
};

export default function CompetitionStats({
  prizePool,
  entryFee,
  registeredParticipants,
  maxParticipants,
}: CompetitionStatsProps) {
  const spotsLeft = Math.max(
    maxParticipants - registeredParticipants,
    0
  );

  const progress =
    maxParticipants > 0
      ? Math.min(
          (registeredParticipants / maxParticipants) * 100,
          100
        )
      : 0;

  return (
    <View style={styles.statsRow}>
      <View style={styles.stat}>
        <Text style={styles.statLabel}>Prize Pool</Text>
        <Text style={styles.prize}>₹ {prizePool}</Text>
      </View>

      <View style={styles.stat}>
        <Text style={styles.statLabel}>Entry Fee</Text>
        <Text style={styles.statValue}>₹ {entryFee}</Text>
      </View>

      <View style={styles.stat}>
        <View style={styles.spotsTitle}>
          <Ionicons
            name="people-outline"
            size={18}
            color="#087f8c"
          />

          <Text style={styles.spotsText}>
            Only {spotsLeft} spots left
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progress,
              {
                width: `${progress}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.bookingText}>
          {registeredParticipants} / {maxParticipants} Booked
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});