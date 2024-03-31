import './MilestonesList.scss';

import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate ,useParams } from "react-router-dom";

import Loading from "../../component/Loading/Loading";
import MilestonCard from "../MilestonCard/MilestonCard";

function MilestonesList() {
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedAuth, setFailedAuth] = useState(false);

  const { profileId } = useParams();

  const navigate = useNavigate();

  const getMilestones = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/milstones/${profileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMilestones(response.data);
    } catch (error) {
      console.error(error);
      setFailedAuth(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getMilestones();
  }, [profileId]);

  if (failedAuth) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <section className="milestones">
        {milestones
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date)) //to order according to the create date
        .map((milestone) => (
          
          <Link to={`milestones/${milestone.id}`} key={milestone.id} className="milestone__item">
            <MilestonCard
              title={milestone.title}
              description={milestone.description}
              media={milestone.media}
              date={milestone.date}
            />
          </Link>
        ))}
      </section>
    </div>
  );
}

export default MilestonesList;
