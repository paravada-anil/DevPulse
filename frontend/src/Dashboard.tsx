import { useEffect, useState } from "react";

type Skill = {
  name: string;
  progress: number;
};

type User = {
  name: string;
  email: string;
  bio: string;
  skills: Skill[];
};

type GithubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
};

type GithubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
};

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  const [skill, setSkill] = useState("");
  const [progress, setProgress] = useState("0");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("");

  const [githubUsername, setGithubUsername] = useState("");
  const [githubUser, setGithubUser] = useState<GithubUser | null>(null);
  const [repositories, setRepositories] = useState<GithubRepo[]>([]);
  const [githubLoading, setGithubLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://devpulse-backend-oabh.onrender.com/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        setBio(data.bio || "");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("USER ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!skill.trim()) {
      alert("Please enter a skill");
      return;
    }

    if (!token) {
      alert("Please login again");
      return;
    }

    let progressValue = Number(progress);

    if (isNaN(progressValue)) {
      progressValue = 0;
    }

    progressValue = Math.max(
      0,
      Math.min(100, progressValue)
    );

    setAdding(true);

    try {
      const response = await fetch(
        "https://devpulse-backend-oabh.onrender.com/api/auth/skills",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            skill: skill.trim(),
            progress: progressValue,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser((oldUser) => {
          if (!oldUser) return oldUser;

          return {
            ...oldUser,
            skills: data.skills,
          };
        });

        setSkill("");
        setProgress("0");

        alert("Skill added successfully");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("ADD SKILL ERROR:", error);
      alert("Failed to add skill");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveSkill = async (
    skillName: string
  ) => {
    if (!token) return;

    try {
      const response = await fetch(
        `https://devpulse-backend-oabh.onrender.com/api/auth/skills/${encodeURIComponent(
          skillName
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser((oldUser) => {
          if (!oldUser) return oldUser;

          return {
            ...oldUser,
            skills: data.skills,
          };
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("REMOVE ERROR:", error);
      alert("Failed to remove skill");
    }
  };

  const handleSaveBio = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        "https://devpulse-backend-oabh.onrender.com/api/auth/bio",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bio,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser((oldUser) => {
          if (!oldUser) return oldUser;

          return {
            ...oldUser,
            bio: data.bio,
          };
        });

        setEditingBio(false);
        alert("Bio updated successfully");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("BIO ERROR:", error);
      alert("Failed to update bio");
    }
  };

  const connectGithub = async () => {
    const username = githubUsername.trim();

    if (!username) {
      alert("Enter GitHub username");
      return;
    }

    setGithubLoading(true);

    try {
      const userResponse = await fetch(
        `https://api.github.com/users/${username}`
      );

      if (!userResponse.ok) {
        alert("GitHub user not found");
        setGithubLoading(false);
        return;
      }

      const githubData = await userResponse.json();

      setGithubUser(githubData);

      const repoResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`
      );

      const repoData = await repoResponse.json();

      setRepositories(repoData);
    } catch (error) {
      console.log("GITHUB ERROR:", error);
      alert("Failed to connect GitHub");
    } finally {
      setGithubLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const overallProgress =
    user && user.skills.length > 0
      ? Math.round(
          user.skills.reduce(
            (total, item) =>
              total + item.progress,
            0
          ) / user.skills.length
        )
      : 0;

  const getLevel = (value: number) => {
    if (value >= 80) return "🔥 Advanced";
    if (value >= 50) return "🚀 Intermediate";
    if (value > 0) return "🌱 Beginner";
    return "Not started";
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading DevPulse... 🚀</h2>
      </div>
    );
  }

  return (
    <div className="layout">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          🚀 DevPulse
        </div>

        <div className="sidebar-user">

          <div className="sidebar-avatar">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "D"}
          </div>

          <h3>
            {user?.name || "Developer"}
          </h3>

          <p>Developer</p>

        </div>

        <nav className="sidebar-menu">

          <a href="#profile">
            👤 Profile
          </a>

          <a href="#skills">
            💻 Skills
          </a>

          <a href="#progress">
            📈 Progress
          </a>

          <a href="#github">
            🐙 GitHub
          </a>

        </nav>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <div className="dashboard-content">

        <header className="topbar">

          <div>
            <h1>DevPulse 🚀</h1>

            <p>
              Developer Learning Dashboard
            </p>
          </div>

          <button
            className="topbar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </header>

        <main>

          {/* WELCOME */}

          <section className="welcome">

            <h2>
              Welcome,{" "}
              {user?.name || "Developer"} 👋
            </h2>

            <p>
              Track your developer learning
              progress.
            </p>

          </section>

          {/* PROFILE */}

          <section
            className="card"
            id="profile"
          >

            <h2>👤 Profile</h2>

            <div className="profile-info">

              <p>
                <strong>Name:</strong>{" "}
                {user?.name ||
                  "Not available"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {user?.email ||
                  "Not available"}
              </p>

            </div>

            <div className="bio-section">

              <p>
                <strong>Bio:</strong>
              </p>

              {!editingBio ? (
                <>
                  <p>
                    {user?.bio ||
                      "No bio added yet."}
                  </p>

                  <button
                    className="edit-bio-button"
                    onClick={() =>
                      setEditingBio(true)
                    }
                  >
                    ✏️ Edit Bio
                  </button>
                </>
              ) : (
                <div className="bio-editor">

                  <textarea
                    value={bio}
                    onChange={(e) =>
                      setBio(e.target.value)
                    }
                    placeholder="Write something about yourself..."
                    rows={4}
                  />

                  <div className="bio-buttons">

                    <button
                      className="save-bio-button"
                      onClick={handleSaveBio}
                    >
                      Save
                    </button>

                    <button
                      className="cancel-bio-button"
                      onClick={() => {
                        setBio(
                          user?.bio || ""
                        );
                        setEditingBio(false);
                      }}
                    >
                      Cancel
                    </button>

                  </div>

                </div>
              )}

            </div>

          </section>

          {/* SKILLS */}

          <section
            className="card"
            id="skills"
          >

            <h2>💻 My Skills</h2>

            <div className="skill-form">

              <input
                type="text"
                placeholder="Enter skill (e.g. React)"
                value={skill}
                onChange={(e) =>
                  setSkill(e.target.value)
                }
              />

              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) =>
                  setProgress(e.target.value)
                }
              />

              <button
                onClick={handleAddSkill}
                disabled={adding}
              >
                {adding
                  ? "Adding..."
                  : "+ Add Skill"}
              </button>

            </div>

            <div className="skills-list">

              {user &&
              user.skills.length > 0 ? (
                user.skills.map((item) => (
                  <div
                    className="skill-item"
                    key={item.name}
                  >

                    <div className="skill-header">

                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        {item.progress}%
                      </span>

                    </div>

                    <p className="skill-level">
                      Level:{" "}
                      {getLevel(
                        item.progress
                      )}
                    </p>

                    <div className="progress-bg">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.progress}%`,
                        }}
                      />

                    </div>

                    <button
                      onClick={() =>
                        handleRemoveSkill(
                          item.name
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>
                ))
              ) : (
                <p>
                  No skills added yet.
                </p>
              )}

            </div>

          </section>

          {/* OVERALL PROGRESS */}

          <section
            className="card"
            id="progress"
          >

            <h2>
              📈 Overall Progress
            </h2>

            <div className="overall-progress">

              <div className="progress-number">
                {overallProgress}%
              </div>

              <p>
                Average learning progress
              </p>

              <strong className="overall-level">
                {getLevel(overallProgress)}
              </strong>

            </div>

            <div className="progress-bg large">

              <div
                className="progress-fill"
                style={{
                  width: `${overallProgress}%`,
                }}
              />

            </div>

            <p className="progress-text">
              {user &&
              user.skills.length > 0
                ? `Based on ${user.skills.length} skill${
                    user.skills.length > 1
                      ? "s"
                      : ""
                  }`
                : "Add a skill to start tracking progress"}
            </p>

          </section>

          {/* GITHUB */}

          <section
            className="card"
            id="github"
          >

            <h2>🐙 GitHub Activity</h2>

            {!githubUser ? (
              <>

                <p>
                  Connect your GitHub profile
                  to view your public GitHub
                  information.
                </p>

                <div className="github-form">

                  <input
                    type="text"
                    placeholder="Enter GitHub username"
                    value={githubUsername}
                    onChange={(e) =>
                      setGithubUsername(
                        e.target.value
                      )
                    }
                  />

                  <button
                    onClick={connectGithub}
                    disabled={githubLoading}
                  >
                    {githubLoading
                      ? "Connecting..."
                      : "🔗 Connect GitHub"}
                  </button>

                </div>

              </>
            ) : (
              <>

                <div className="github-profile">

                  <img
                    src={
                      githubUser.avatar_url
                    }
                    alt="GitHub avatar"
                    className="github-avatar"
                  />

                  <h3>
                    {githubUser.name ||
                      githubUser.login}
                  </h3>

                  <p className="github-username">
                    @{githubUser.login}
                  </p>

                  <div className="github-stats">

                    <div>
                      <strong>
                        {
                          githubUser.public_repos
                        }
                      </strong>

                      <span>
                        Repositories
                      </span>
                    </div>

                    <div>
                      <strong>
                        {githubUser.followers}
                      </strong>

                      <span>
                        Followers
                      </span>
                    </div>

                    <div>
                      <strong>
                        {githubUser.following}
                      </strong>

                      <span>
                        Following
                      </span>
                    </div>

                  </div>

                  <a
                    href={
                      githubUser.html_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="github-button"
                  >
                    View GitHub Profile →
                  </a>

                </div>

                <div className="github-repositories">

                  <h3>
                    📦 Repositories
                  </h3>

                  <div className="repo-grid">

                    {repositories.map(
                      (repo) => (
                        <div
                          className="repo-card"
                          key={repo.id}
                        >

                          <h4>
                            {repo.name}
                          </h4>

                          <p className="repo-description">
                            {repo.description ||
                              "No description available."}
                          </p>

                          <div className="repo-info">

                            <span>
                              ⭐{" "}
                              {
                                repo.stargazers_count
                              }
                            </span>

                            <span>
                              🍴{" "}
                              {
                                repo.forks_count
                              }
                            </span>

                            <span>
                              💻{" "}
                              {repo.language ||
                                "Unknown"}
                            </span>

                          </div>

                          <a
                            href={
                              repo.html_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="repo-button"
                          >
                            View Repository →
                          </a>

                        </div>
                      )
                    )}

                  </div>

                </div>

              </>
            )}

          </section>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;