import { DataSource } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { Team } from '../../enums';

export const seedRoles = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);

  const defaultRoles = [
    {
      name: 'Citizen',
      team: Team.CITIZEN,
      abilities: {},
      canVote: true,
      nightOrder: 0,
      isCustom: false,
      description: 'Ordinary citizen. No special abilities. Wins by eliminating all Mafia and Serial Killers.',
      knowsTeamMembers: false,
    },
    {
      name: 'Mafia',
      team: Team.MAFIA,
      abilities: {
        kill: {
          enabled: true,
        },
      },
      canVote: true,
      nightOrder: 1,
      isCustom: false,
      description: 'Member of the Mafia. Can kill one player each night. Knows all other Mafia members.',
      knowsTeamMembers: true,
    },
    {
      name: 'Don Mafia',
      team: Team.MAFIA,
      abilities: {
        check: {
          enabled: true,
          canCheckSameTwice: true,
        },
      },
      canVote: true,
      nightOrder: 1,
      isCustom: false,
      description: 'Leader of the Mafia. Can check if a player is the Detective. Knows all Mafia members.',
      knowsTeamMembers: true,
    },
    {
      name: 'Detective',
      team: Team.CITIZEN,
      abilities: {
        check: {
          enabled: true,
          canCheckSameTwice: false,
        },
      },
      canVote: true,
      nightOrder: 4,
      isCustom: false,
      description: 'Investigates players at night. Can check if a player is Mafia. Cannot check the same player twice.',
      knowsTeamMembers: false,
    },
    {
      name: 'Doctor',
      team: Team.CITIZEN,
      abilities: {
        heal: {
          enabled: true,
          limitPerPlayer: 1,
        },
      },
      canVote: true,
      nightOrder: 3,
      isCustom: false,
      description: 'Can heal one player each night, protecting them from being killed. Limited heals per player.',
      knowsTeamMembers: false,
    },
    {
      name: 'Serial Killer',
      team: Team.SOLO,
      abilities: {
        kill: {
          enabled: true,
          limit: 3,
        },
      },
      canVote: true,
      nightOrder: 2,
      isCustom: false,
      description: 'Solo player. Can kill players at night. Limited total kills. Wins by being last player alive.',
      knowsTeamMembers: false,
    },
  ];

  for (const roleData of defaultRoles) {
    const existingRole = await roleRepository.findOne({ where: { name: roleData.name } });
    
    if (!existingRole) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`Created role: ${roleData.name}`);
    } else {
      console.log(`Role already exists: ${roleData.name}`);
    }
  }

  console.log('Default roles seeding completed');
};
