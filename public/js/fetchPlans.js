document.addEventListener('DOMContentLoaded', function() {
    const eggSelect = document.getElementById('egg');
    const nodeSelect = document.getElementById('node');
    const planDetailsDiv = document.getElementById('plan-details');

    eggSelect.addEventListener('change', updatePlans);
    nodeSelect.addEventListener('change', updatePlans);

    function updatePlans() {
        const selectedEgg = eggSelect.value;
        const selectedNode = nodeSelect.value;

        if (selectedEgg && selectedNode) {
            fetch(`/api/plans?egg=${selectedEgg}&node=${selectedNode}`)
                .then(response => response.json())
                .then(plans => {
                    // Clear existing plan details
                    planDetailsDiv.innerHTML = '';
                    // Populate new plan details
                    plans.forEach(plan => {
                        const planDiv = document.createElement('div');
                        planDiv.classList.add('p-4', 'bg-slate-600', 'rounded-md', 'text-center');
                        planDiv.innerHTML = `
                                <h1 class="text-lg text-white">${plan.name}</h1>
                                <ul class="text-base text-white">
                                    <li><i class="fa-solid fa-microchip"></i>&nbsp;CPU: ${plan.cpu} %</li>
                                    <li><i class="fa-solid fa-memory"></i>&nbsp;RAM: ${plan.ram} MB</li>
                                    <li><i class="fa-solid fa-hdd"></i>&nbsp;Disk: ${plan.disk} MB</li>
                                    <li><i class="fa-solid fa-wifi"></i>&nbsp;Ports: ${plan.allocations}</li>
                                    <li><i class="fa-solid fa-clock"></i>&nbsp;Databases: ${plan.databases}</li>
                                    <li><i class="fa-solid fa-arrow-up"></i>&nbsp;Backups: ${plan.backups}</li>
                                    <li><i class="fa-solid fa-money-bill"></i>&nbsp;${plan.price}/mo</li>
                                </ul>`;
                        planDetailsDiv.appendChild(planDiv);
                    });
                })
                .catch(error => console.error('Error fetching plans:', error));
        }
    }
});