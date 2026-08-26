import os

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group


class Command(BaseCommand):
    help = "Create the initial production admin user and assign a role."

    def handle(self, *args, **options):
        username = os.getenv("ADMIN_USERNAME")
        email = os.getenv("ADMIN_EMAIL")
        password = os.getenv("ADMIN_PASSWORD")
        role = os.getenv("ADMIN_ROLE", "admin")

        if not username or not email or not password:
            self.stdout.write(
                self.style.WARNING(
                    "ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD "
                    "are not set. Skipping admin creation."
                )
            )
            return

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
            },
        )

        if created:
            user.set_password(password)
            user.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Created admin user: {username}"
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"User '{username}' already exists."
                )
            )

        group, _ = Group.objects.get_or_create(name=role)

        user.groups.add(group)

        self.stdout.write(
            self.style.SUCCESS(
                f"Assigned role '{role}' to '{username}'."
            )
        )