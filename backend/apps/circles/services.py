"""
话题圈服务 / Circle Services
"""

from .models import Circle, CircleMember


def auto_join_circles(user):
    """
    自动加入校级圈和年级圈 / Auto join school and grade circles
    在用户完善资料后调用 / Called after user completes profile
    """
    if not hasattr(user, 'profile') or not user.profile.school:
        return

    profile = user.profile
    school = profile.school

    # 1. 查找或创建校级圈 / Find or create school circle
    school_circle, _ = Circle.objects.get_or_create(
        school=school,
        circle_type='school',
        grade_year=None,
        class_name='',
        defaults={
            'name': f"{school.name}",
            'created_by': user,
            'owner': user,
        }
    )

    # 加入校级圈 / Join school circle
    CircleMember.objects.get_or_create(
        circle=school_circle,
        user=user,
        defaults={'status': 'approved', 'role': 'member'}
    )

    # 2. 查找或创建年级圈 / Find or create grade circle
    if profile.enrollment_year:
        grade_circle, _ = Circle.objects.get_or_create(
            school=school,
            circle_type='grade',
            grade_year=profile.enrollment_year,
            class_name='',
            defaults={
                'name': f"{school.name} {profile.enrollment_year}级",
                'created_by': user,
                'owner': user,
            }
        )

        # 加入年级圈 / Join grade circle
        CircleMember.objects.get_or_create(
            circle=grade_circle,
            user=user,
            defaults={'status': 'approved', 'role': 'member'}
        )


def get_circle_or_none(pk):
    """
    获取圈子，不存在返回 None / Get circle or None if not exists
    """
    try:
        return Circle.objects.select_related('school').get(pk=pk)
    except Circle.DoesNotExist:
        return None


def is_circle_admin(circle, user):
    """
    检查用户是否是圈子管理员或圈主 / Check if user is circle admin or owner
    """
    if circle.owner_id == user.id:
        return True
    return CircleMember.objects.filter(
        circle=circle,
        user=user,
        role='admin',
        status='approved'
    ).exists()
