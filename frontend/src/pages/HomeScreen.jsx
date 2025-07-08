import React, { useState } from 'react';
import { Bell, Calendar, Users, Clock, CheckCircle, XCircle, Camera } from 'lucide-react';
import giraffeIcon from "../assets/Logo.png";
import { useNavigate } from 'react-router-dom';
const HomeScreen = () => {
     const navigate = useNavigate();
     const handleDailyReportClick = () => {
    navigate('/daily-reports'); // Adjust route path as needed
  };
  const handleChildDataClick = () => {
  navigate('/child-report');
};

  const [students] = useState([
    {
      id: 1,
      name: 'Mimansa',
      grade: 'Playgroup',
      attendance: '1/30',
      inTime: '---',
      outTime: '---',
      isPresent: false,
      avatar: '👶'
    },
    {
      id: 2,
      name: 'Mimansa',
      grade: 'Nursery',
      attendance: '3/30',
      inTime: '10:00',
      outTime: '15:00',
      isPresent: true,
      avatar: '👧'
    },
    {
      id: 3,
      name: 'Mimansa',
      grade: 'Playgroup',
      attendance: '3/30',
      inTime: '10:00',
      outTime: '15:00',
      isPresent: true,
      avatar: '👦'
    }
  ]);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      padding: '0',
      margin: '0'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e0e6ed',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
  <img src={giraffeIcon} alt="logo" className="login-logo" />
  <nav style={{ display: 'flex', gap: '2rem' }}>
    <span style={{ color: '#8b5cf6', fontWeight: '500', cursor: 'pointer' }}>Home</span>
    <span
      style={{ color: '#6b7280', cursor: 'pointer' }}
      onClick={handleDailyReportClick}
    >
      Daily Report
    </span>
<span
    style={{ color: '#6b7280', cursor: 'pointer' }}
    onClick={() => navigate('/reports')}
  >
    Reports
  </span>
    <span
      style={{ color: '#6b7280', cursor: 'pointer' }}
      onClick={handleChildDataClick}
    >
      Child Data
    </span>
    <span
  style={{ color: '#6b7280', cursor: 'pointer' }}
  onClick={() => navigate('/themes')}
>
  Theme
</span>

<span
  style={{ color: '#6b7280', cursor: 'pointer' }}
  onClick={() => navigate('/fees')}
>
  Fees
</span>

  </nav>
</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>Inbox</span>
            <Bell size={16} />
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            👩
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        {/* Welcome Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            color: '#374151',
            margin: '0'
          }}>
            Welcome <span style={{ fontWeight: 'bold' }}>Hema,</span>
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Camera size={16} />
              Gallery
            </button>
            <button style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Calendar size={16} />
              Holidays 🎉
            </button>
            <button style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Logout ↗
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Today's Attendance Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Calendar size={20} color="#3b82f6" />
              <h3 style={{
                color: '#3b82f6',
                fontSize: '1.25rem',
                margin: '0'
              }}>Today Attendance</h3>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Calendar size={16} color="#6b7280" />
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Jun 07, 2025</span>
            </div>
            <div style={{
              fontSize: '1.5rem',
              color: '#3b82f6',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              10/12 Done
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '83%',
                height: '100%',
                background: 'linear-gradient(90deg, #84cc16 0%, #65a30d 100%)',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>

          {/* Grade Statistics */}
          <div style={{
            backgroundColor: '#84cc16',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              👶
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>5</div>
            <div style={{
              fontSize: '0.875rem',
              marginBottom: '0.25rem'
            }}>20% of the class</div>
            <div style={{
              fontSize: '0.875rem',
              opacity: '0.8'
            }}>Grade:</div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Playgroup</div>
          </div>

          <div style={{
            backgroundColor: '#f59e0b',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              👧
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>20</div>
            <div style={{
              fontSize: '0.875rem',
              marginBottom: '0.25rem'
            }}>50% of the class</div>
            <div style={{
              fontSize: '0.875rem',
              opacity: '0.8'
            }}>Grade:</div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Nursery</div>
          </div>

          <div style={{
            backgroundColor: '#f87171',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              👦
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>7</div>
            <div style={{
              fontSize: '0.875rem',
              marginBottom: '0.25rem'
            }}>30% of the class</div>
            <div style={{
              fontSize: '0.875rem',
              opacity: '0.8'
            }}>Grade:</div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Pre primary I</div>
          </div>
        </div>

        {/* Student Record Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            color: '#374151',
            marginBottom: '1.5rem'
          }}>Student Record:</h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Full Name</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Grade</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Attendance</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>In - time</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Out - time</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Present</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Absent</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} style={{
                    backgroundColor: index === 0 ? '#fef2f2' : index === 1 ? '#fefce8' : '#f0fdf4',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <td style={{
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        {student.avatar}
                      </div>
                      <span style={{
                        color: '#374151',
                        fontWeight: '500'
                      }}>{student.name}</span>
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#374151'
                    }}>{student.grade}</td>
                    <td style={{
                      padding: '1rem',
                      color: '#374151'
                    }}>{student.attendance}</td>
                    <td style={{
                      padding: '1rem',
                      color: '#374151'
                    }}>{student.inTime}</td>
                    <td style={{
                      padding: '1rem',
                      color: '#374151'
                    }}>{student.outTime}</td>
                    <td style={{
                      padding: '1rem'
                    }}>
                      {student.isPresent ? (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#22c55e',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          ✓
                        </div>
                      ) : (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#6b7280',
                          borderRadius: '4px'
                        }}></div>
                      )}
                    </td>
                    <td style={{
                      padding: '1rem'
                    }}>
                      {!student.isPresent ? (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#ef4444',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          ✓
                        </div>
                      ) : (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#6b7280',
                          borderRadius: '4px'
                        }}></div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;