import { Button } from "@components/ui/button";
import { Activity } from "src/types/api";
import { useNavigate } from "react-router-dom";

interface Props {
  activity: Activity;
}

function RowActions({ activity }: Props) {
  const navigate = useNavigate();

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => navigate(`/activities/${activity.id}/change-status`)}
    >
      Change status
    </Button>
  );
}

export default RowActions;
