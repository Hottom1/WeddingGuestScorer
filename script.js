let guestList = [];

// Handle form submission
document.getElementById('guestForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Get selected values
  const guestName = document.getElementById('guestName').value;
  const relationship = parseInt(document.getElementById('relationship').value);
  const involvement = parseInt(document.getElementById('involvement').value);
  const emotionalImportance = parseInt(document.getElementById('emotionalImportance').value);
  const reciprocity = parseInt(document.getElementById('reciprocity').value);
  const logistics = parseInt(document.getElementById('logistics').value);

  // Calculate total score
  const totalScore = relationship + involvement + emotionalImportance + reciprocity + logistics;

  // Add guest to the list
  guestList.push({
    name: guestName,
    relationship,
    involvement,
    emotionalImportance,
    reciprocity,
    logistics,
    totalScore,
    priority: getPriorityLevel(totalScore),
  });

  // Display result
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <p>${guestName}'s Total Score: <strong>${totalScore}</strong></p>
    <p>${getPriorityLevel(totalScore)}</p>
  `;

  // Clear form
  document.getElementById('guestForm').reset();
});

// Handle CSV upload
document.getElementById('processCSV').addEventListener('click', function () {
  const fileInput = document.getElementById('uploadCSV');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const rows = text.split('\n').slice(1); // Skip header row
      rows.forEach(row => {
        const [name, relationship, involvement, emotionalImportance, reciprocity, logistics] = row.split(',');

        const totalScore =
          parseInt(relationship) +
          parseInt(involvement) +
          parseInt(emotionalImportance) +
          parseInt(reciprocity) +
          parseInt(logistics);

        guestList.push({
          name,
          relationship: parseInt(relationship),
          involvement: parseInt(involvement),
          emotionalImportance: parseInt(emotionalImportance),
          reciprocity: parseInt(reciprocity),
          logistics: parseInt(logistics),
          totalScore,
          priority: getPriorityLevel(totalScore),
        });
      });

      alert(`${rows.length} guests processed and added to the list!`);
    };
    reader.readAsText(file);
  } else {
    alert('Please upload a CSV file.');
  }
});

// Handle CSV export
document.getElementById('exportCSV').addEventListener('click', function () {
  if (guestList.length === 0) {
    alert('No guests to export!');
    return;
  }

  const csvContent = [
    'Name,Relationship,Involvement,Emotional Importance,Reciprocity,Logistics,Total Score,Priority',
    ...guestList.map(guest =>
      `${guest.name},${guest.relationship},${guest.involvement},${guest.emotionalImportance},${guest.reciprocity},${guest.logistics},${guest.totalScore},${guest.priority}`
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Wedding_Guest_List.csv';
  link.click();
});

// Helper function to get priority level
function getPriorityLevel(score) {
  if (score >= 90) return 'Must-invite (VIP)';
  if (score >= 70) return 'Strong candidate for the guest list';
  if (score >= 50) return 'Consider inviting if space allows';
  return 'Likely not a priority';
}