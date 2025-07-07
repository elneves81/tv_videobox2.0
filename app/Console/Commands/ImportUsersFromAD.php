<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Location;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ImportUsersFromAD extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ad:import 
                            {--file= : CSV file path to import from}
                            {--dry-run : Run without making changes}
                            {--sync : Sync existing users}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import/Sync users from Active Directory (simulated via CSV)';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $file = $this->option('file') ?? public_path('ad-export.csv');
        $dryRun = $this->option('dry-run');
        $sync = $this->option('sync');

        if (!file_exists($file)) {
            $this->error("File not found: {$file}");
            $this->info("Creating sample file at: {$file}");
            $this->createSampleFile($file);
            return Command::FAILURE;
        }

        $this->info("Starting AD import from: {$file}");
        
        if ($dryRun) {
            $this->warn("DRY RUN MODE - No changes will be made");
        }

        $data = $this->readCSVFile($file);
        $stats = [
            'processed' => 0,
            'created' => 0,
            'updated' => 0,
            'errors' => 0
        ];

        $progressBar = $this->output->createProgressBar(count($data));
        $progressBar->start();

        foreach ($data as $userData) {
            try {
                $result = $this->processUser($userData, $dryRun, $sync);
                $stats[$result]++;
                $stats['processed']++;
            } catch (\Exception $e) {
                $stats['errors']++;
                $this->error("Error processing user {$userData['email']}: " . $e->getMessage());
            }
            
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->displayStats($stats);
        
        return Command::SUCCESS;
    }

    private function readCSVFile($file)
    {
        $data = [];
        $handle = fopen($file, 'r');
        $header = fgetcsv($handle);
        
        while (($row = fgetcsv($handle)) !== false) {
            $data[] = array_combine($header, $row);
        }
        
        fclose($handle);
        return $data;
    }

    private function processUser($userData, $dryRun, $sync)
    {
        $email = $userData['email'];
        $existingUser = User::where('email', $email)->first();

        // Preparar dados do usuário
        $userAttributes = $this->prepareUserAttributes($userData);

        if ($existingUser) {
            if ($sync) {
                if (!$dryRun) {
                    $existingUser->update($userAttributes);
                }
                $this->line("Updated: {$email}");
                return 'updated';
            } else {
                $this->line("Skipped existing: {$email}");
                return 'processed';
            }
        } else {
            if (!$dryRun) {
                User::create($userAttributes);
            }
            $this->line("Created: {$email}");
            return 'created';
        }
    }

    private function prepareUserAttributes($userData)
    {
        // Buscar ou criar localização
        $location = null;
        if (!empty($userData['location'])) {
            $location = Location::firstOrCreate(
                ['name' => $userData['location']],
                [
                    'short_name' => $userData['location'],
                    'is_active' => true
                ]
            );
        }

        return [
            'name' => $userData['name'],
            'email' => $userData['email'],
            'password' => Hash::make($userData['password'] ?? 'DefaultP@ss123'),
            'role' => $this->mapRole($userData['role'] ?? 'customer'),
            'phone' => $userData['phone'] ?? null,
            'department' => $userData['department'] ?? null,
            'location_id' => $location?->id,
            'employee_id' => $userData['employee_id'] ?? null,
            'ldap_dn' => $userData['dn'] ?? null,
            'is_active' => ($userData['enabled'] ?? 'true') === 'true'
        ];
    }

    private function mapRole($adRole)
    {
        $roleMapping = [
            'Domain Admins' => 'admin',
            'IT Support' => 'technician',
            'Help Desk' => 'technician',
            'Administrators' => 'admin',
            'Users' => 'customer',
            'Domain Users' => 'customer'
        ];

        return $roleMapping[$adRole] ?? 'customer';
    }

    private function createSampleFile($file)
    {
        $sampleData = [
            ['name', 'email', 'employee_id', 'department', 'location', 'phone', 'role', 'enabled', 'dn', 'password'],
            ['João Silva', 'joao.silva@empresa.com', 'EMP001', 'TI', 'Matriz São Paulo', '(11) 99999-1111', 'IT Support', 'true', 'CN=João Silva,OU=Users,DC=empresa,DC=com', 'TempPass123'],
            ['Maria Santos', 'maria.santos@empresa.com', 'EMP002', 'RH', 'Matriz São Paulo', '(11) 99999-2222', 'Users', 'true', 'CN=Maria Santos,OU=Users,DC=empresa,DC=com', 'TempPass123'],
            ['Pedro Admin', 'pedro.admin@empresa.com', 'EMP003', 'TI', 'Filial Rio', '(21) 99999-3333', 'Domain Admins', 'true', 'CN=Pedro Admin,OU=Admins,DC=empresa,DC=com', 'TempPass123'],
            ['Ana Técnica', 'ana.tecnica@empresa.com', 'EMP004', 'Suporte', 'Matriz São Paulo', '(11) 99999-4444', 'Help Desk', 'true', 'CN=Ana Técnica,OU=Users,DC=empresa,DC=com', 'TempPass123'],
            ['Carlos Vendas', 'carlos.vendas@empresa.com', 'EMP005', 'Vendas', 'Filial BH', '(31) 99999-5555', 'Users', 'false', 'CN=Carlos Vendas,OU=Users,DC=empresa,DC=com', 'TempPass123']
        ];

        $handle = fopen($file, 'w');
        foreach ($sampleData as $row) {
            fputcsv($handle, $row);
        }
        fclose($handle);
        
        $this->info("Sample AD export file created at: {$file}");
    }

    private function displayStats($stats)
    {
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Processed', $stats['processed']],
                ['Created', $stats['created']],
                ['Updated', $stats['updated']],
                ['Errors', $stats['errors']]
            ]
        );

        if ($stats['errors'] > 0) {
            $this->warn("There were {$stats['errors']} errors during import");
        } else {
            $this->info("Import completed successfully!");
        }
    }
}
