<?php

namespace Deploy\Processors;

use Deploy\Contracts\Processors\ProcessorInterface;
use Deploy\Ssh\Host;
use Deploy\Models\Server;

abstract class AbstractProcessor implements ProcessorInterface
{
    /**
     * Return SSH Host.
     *
     * @param  \Deploy\Models\Server $server
     * @return \Deploy\Ssh\Host
     */
    protected function getHost(Server $server)
    {
        $host = new Host($server->ip_address);
        $keyPath = $this->getKeyPath($server->id);
        
        // In order to use the private key to ssh into a desired destination
        // we must set the correct permissions required for a private key.
        chmod($keyPath, 0600);
        
        return $host->user($server->connect_as)
            ->port($server->port)
            ->identityFile($keyPath)
            ->addSshOption('StrictHostKeyChecking', 'no');
    }
    
    /**
     * Return absolute path to ssh key.
     *
     * @param  int $serverId
     * @return string
     */
    protected function getKeyPath($serverId)
    {
        $sshKeyPath = rtrim(config('deploy.ssh_key.path'), '/') . '/';
        
        return $sshKeyPath . $serverId;
    }
    
    /**
     * Contains logic to run processors.
     *
     * @return void
     */
    abstract public function fire();
}
