import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type ImportantDatesProps = {
  registrationEnd: string;
  submissionStart: string;
  submissionEnd: string;
  resultDate: string;
};

export default function ImportantDates({
  registrationEnd,
  submissionStart,
  submissionEnd,
  resultDate,
}: ImportantDatesProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Important Dates</Text>

      <View style={styles.dateGrid}>
        <DateItem
          icon="calendar-outline"
          label="Register Before"
          date={registrationEnd}
        />

        <DateItem
          icon="paper-plane-outline"
          label="Submission Starts"
          date={submissionStart}
        />

        <DateItem
          icon="cloud-upload-outline"
          label="Submission Ends"
          date={submissionEnd}
        />

        <DateItem
          icon="trophy-outline"
          label="Result Date"
          date={resultDate}
        />
      </View>
    </View>
  );
}

function DateItem({
  icon,
  label,
  date,
}: {
  icon: any;
  label: string;
  date: string;
}) {
  return (
    <View style={styles.dateItem}>
      <Ionicons name={icon} size={26} color="#087f8c" />

      <View>
        <Text style={styles.dateLabel}>{label}</Text>
        <Text style={styles.dateValue}>{formatDate(date)}</Text>
      </View>
    </View>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
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

  sectionTitle: {
    color: "#183153",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 15,
  },

  dateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dateItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#e7edef",
  },

  dateLabel: {
    color: "#718198",
    fontSize: 12,
    marginBottom: 3,
  },

  dateValue: {
    color: "#087f8c",
    fontWeight: "700",
  },
});